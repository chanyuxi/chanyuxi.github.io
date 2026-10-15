import type { Plugin } from 'vite'

import {
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from 'node:fs/promises'
import { createRequire } from 'node:module'
import {
  dirname,
  extname,
  isAbsolute,
  relative,
  resolve,
} from 'node:path'

export interface CharacterSetTarget {
  /**
   * Extracts the characters to keep from each monitored file's content.
   * Return an empty string for content that contributes nothing.
   */
  match: (content: string) => string
  /**
   * Directories or files whose content feeds the character set.
   * Paths that are neither a readable directory nor a text file fail silently.
   */
  monitorFolder: string[]
  /** Path of the subsetted font to write. */
  output: string
  /** Path of the source font to subset. */
  source: string
  /** Fixed characters that are always included in the subset. */
  staticCharacters?: string
}

interface CharacterSetCacheEntry {
  characters: string
  fontMtimeMs: number
}

interface FontCacheEntry {
  buffer: Buffer
  mtimeMs: number
}

interface GenerationCaches {
  characters: Map<string, CharacterSetCacheEntry>
  fonts: Map<string, FontCacheEntry>
}

type SubsetFont = (
  buffer: Buffer,
  text: string,
  options: { targetFormat: 'woff2' },
) => Promise<Buffer>

const TEXT_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.md',
  '.mdx',
  '.ts',
  '.tsx',
])

const require = createRequire(import.meta.url)
const subsetFont = require('subset-font') as SubsetFont

export function characterSetExtractor(targets: CharacterSetTarget[]): Plugin {
  let root = process.cwd()
  let regenerationTimer: ReturnType<typeof setTimeout> | undefined
  let regeneration = Promise.resolve()
  const caches: GenerationCaches = { characters: new Map(), fonts: new Map() }

  const generate = () => generateCharacterSets(root, targets, caches)

  const monitorRoots = () => targets.flatMap(target =>
    target.monitorFolder.map(folder => resolve(root, folder)),
  )

  return {
    async buildStart() {
      const result = await generate()

      for (const filepath of result.inputs) {
        this.addWatchFile(filepath)
      }
    },
    configResolved(config) {
      root = config.root
    },
    configureServer(server) {
      const scheduleRegeneration = (filepath: string) => {
        if (!monitorRoots().some(path => isPathInside(filepath, path))) {
          return
        }

        clearTimeout(regenerationTimer)
        regenerationTimer = setTimeout(() => {
          regeneration = regeneration
            .then(generate)
            .then(({ changed }) => {
              if (changed) {
                server.ws.send({ path: '*', type: 'full-reload' })
              }
            })
            .catch(error => server.config.logger.error(
              `Character set extraction failed: ${String(error)}`,
              { error },
            ))
        }, 75)
      }

      server.watcher.on('add', scheduleRegeneration)
      server.watcher.on('change', scheduleRegeneration)
      server.watcher.on('unlink', scheduleRegeneration)

      return () => {
        clearTimeout(regenerationTimer)
      }
    },
    enforce: 'pre',
    name: 'character-set-extractor',
  }
}

async function collectFiles(path: string): Promise<string[]> {
  const stats = await stat(path).catch(() => null)

  if (!stats) return []

  if (stats.isFile()) {
    return TEXT_EXTENSIONS.has(extname(path)) ? [path] : []
  }

  if (!stats.isDirectory()) return []

  const entries = await readdir(path, { withFileTypes: true })
  const files = await Promise.all(entries.map(entry =>
    collectFiles(resolve(path, entry.name)),
  ))

  return files.flat()
}

async function fileExists(path: string) {
  try {
    await stat(path)
    return true
  }
  catch {
    return false
  }
}

async function generateCharacterSets(
  root: string,
  targets: CharacterSetTarget[],
  caches: GenerationCaches,
) {
  const fileCache = new Map<string, string>()
  const inputs = new Set<string>()
  let changed = false

  for (const target of targets) {
    const chunks = await Promise.all(target.monitorFolder.map(async (folder) => {
      const files = await collectFiles(resolve(root, folder))

      return Promise.all(files.map(async (filepath) => {
        inputs.add(filepath)
        let source = fileCache.get(filepath)

        if (source === undefined) {
          source = await readFile(filepath, 'utf8')
          fileCache.set(filepath, source)
        }

        return target.match(source)
      }))
    }))

    const characters = [
      ...new Set(`${chunks.flat().join('')}${target.staticCharacters ?? ''}`),
    ].join('')

    if (!characters) {
      throw new Error(`No characters found for ${target.output}`)
    }

    const sourcePath = resolve(root, target.source)
    const outputPath = resolve(root, target.output)
    inputs.add(sourcePath)
    const sourceFont = await loadFont(sourcePath, caches.fonts)

    const cached = caches.characters.get(outputPath)

    if (
      cached
      && cached.characters === characters
      && cached.fontMtimeMs === sourceFont.mtimeMs
      && await fileExists(outputPath)
    ) {
      continue
    }

    const subset = await subsetFont(
      sourceFont.buffer,
      characters,
      { targetFormat: 'woff2' },
    )

    const upToDate = await isSameFile(outputPath, subset)

    if (!upToDate) {
      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(outputPath, subset)
      changed = true
    }

    caches.characters.set(outputPath, {
      characters,
      fontMtimeMs: sourceFont.mtimeMs,
    })
  }

  return { changed, inputs }
}

function isPathInside(filepath: string, parent: string) {
  const path = relative(parent, filepath)

  return path === '' || (!path.startsWith('..') && !isAbsolute(path))
}

async function isSameFile(path: string, content: Buffer) {
  try {
    return (await readFile(path)).equals(content)
  }
  catch {
    return false
  }
}

async function loadFont(path: string, fontCache: Map<string, FontCacheEntry>) {
  const { mtimeMs } = await stat(path)
  const cached = fontCache.get(path)

  if (cached && cached.mtimeMs === mtimeMs) {
    return cached
  }

  const font = { buffer: await readFile(path), mtimeMs }
  fontCache.set(path, font)

  return font
}
