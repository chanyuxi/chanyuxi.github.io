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

import matter from 'gray-matter'

interface CharacterSetCacheEntry {
  characters: string
  fontMtimeMs: number
}

interface CharacterSetDetection {
  extract?: CharacterSetExtraction
  marker?: string
  path: string
}

type CharacterSetExtraction = 'all' | 'frontmatter'

interface CharacterSetTarget {
  characters?: string
  detect: (CharacterSetDetection | string)[]
  marker?: string
  output: string
  source: string
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

const CODE_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
])

const TEXT_EXTENSIONS = new Set([
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

  const detectionRoots = () => targets.flatMap(target => [
    resolve(root, target.source),
    ...target.detect.map(detection => resolve(
      root,
      typeof detection === 'string' ? detection : detection.path,
    )),
  ])

  const generate = () => generateCharacterSets(root, targets, caches)

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
        if (!detectionRoots().some(path => isPathInside(filepath, path))) {
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
  const stats = await stat(path)

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

function extractFrontmatterCharacters(source: string) {
  return Object.values(matter(source).data)
    .filter(value => typeof value === 'string' || Array.isArray(value))
    .join('')
}

function extractHanCharacters(text: string, decodeEscapes: boolean) {
  const decodedText = decodeEscapes
    ? text.replace(
        /\\u([0-9a-fA-F]{4})/g,
        (_match, code: string) => String.fromCodePoint(Number.parseInt(code, 16)),
      )
    : text

  return decodedText.match(/\p{Script=Han}+/gu)?.join('') ?? ''
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
    const chunks = await Promise.all(target.detect.map(async (detection) => {
      const rule = typeof detection === 'string'
        ? { path: detection }
        : detection
      const detectionPath = resolve(root, rule.path)
      const files = await collectFiles(detectionPath)

      return Promise.all(files.map(async (filepath) => {
        inputs.add(filepath)
        let source = fileCache.get(filepath)

        if (source === undefined) {
          source = await readFile(filepath, 'utf8')
          fileCache.set(filepath, source)
        }

        const marker = rule.marker ?? target.marker
        if (marker && !source.includes(marker)) return ''

        const extract = rule.extract ?? 'all'
        const content = extract === 'frontmatter'
          ? extractFrontmatterCharacters(source)
          : source

        return extractHanCharacters(
          content,
          CODE_EXTENSIONS.has(extname(filepath)),
        )
      }))
    }))

    const characters = [
      ...new Set(`${chunks.flat().join('')}${target.characters ?? ''}`),
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
