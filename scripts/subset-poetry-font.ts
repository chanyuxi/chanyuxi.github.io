// Since Chinese font files are excessively large, this script scans the project
// for all Chinese characters actually used and generates a font subset to accelerate
// webpage loading speeds.

import {
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

type SubsetFont = (
  buffer: Buffer,
  text: string,
  options: { targetFormat: 'woff2' },
) => Promise<Buffer>

const require = createRequire(import.meta.url)
const subsetFont = require('subset-font') as SubsetFont

const d = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const sourceFontPath = d('./assets/MaShanZheng-Regular.ttf')
const outputFontPath = d('../public/fonts/MaShanZheng-Regular.woff2')

const paths = [
  d('../src/modules/poetries/assets/mds/'),
  d('../src/modules/poetries/constants.ts'),
]

const commonPunctuation = '，。！？；：、（）「」『』【】《》〈〉“”‘’…——·～'

const poetryText = `${(await Promise.all(paths.map(readText))).join('\n')}${commonPunctuation}`

if (!poetryText.trim()) {
  throw new Error('No poetry text found for font subsetting.')
}

const subset = await subsetFont(
  await readFile(sourceFontPath),
  poetryText,
  { targetFormat: 'woff2' },
)

await mkdir(dirname(outputFontPath), { recursive: true })
await writeFile(outputFontPath, subset)

console.log(`Wrote ${outputFontPath} (${subset.byteLength} bytes).`)

async function readDirectoryText(directory: string): Promise<string> {
  const entries = await readdir(directory, { withFileTypes: true })
  const contents = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(directory, entry.name)

      if (entry.isDirectory()) {
        return readDirectoryText(entryPath)
      }

      if (!entry.isFile() || !entry.name.endsWith('.md')) {
        return ''
      }

      return readFile(entryPath, 'utf8')
    }),
  )

  return contents.join('\n')
}

async function readText(path: string): Promise<string> {
  const text = (await stat(path)).isDirectory()
    ? await readDirectoryText(path)
    : await readFile(path, 'utf8')
  const decodedText = text.replace(
    /\\u([0-9a-fA-F]{4})/g,
    (_match, code: string) => String.fromCharCode(Number.parseInt(code, 16)),
  )

  return [...decodedText]
    .filter(character => /\p{Script=Han}/u.test(character))
    .join('')
}
