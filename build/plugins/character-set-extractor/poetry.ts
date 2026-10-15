import { characterSetExtractor } from './index'

// Code files may encode characters as \uXXXX escapes; decode them before matching.
const HAN_CHARACTERS = /\p{Script=Han}+/gu

const POETRY_PUNCTUATION = '，。！？；：、（）「」『』【】《》〈〉“”‘’…——·～'

function match(content: string) {
  const decoded = content.replace(
    /\\u([0-9a-fA-F]{4})/g,
    (_escape, code: string) => String.fromCodePoint(Number.parseInt(code, 16)),
  )

  return decoded.match(HAN_CHARACTERS)?.join('') ?? ''
}

export const poetryCharacterSetPlugin = characterSetExtractor([
  {
    match,
    monitorFolder: ['src/modules/poetries'],
    output: 'src/modules/poetries/assets/fonts/MaShanZheng-Regular.woff2',
    source: 'scripts/assets/MaShanZheng-Regular.ttf',
    staticCharacters: POETRY_PUNCTUATION,
  },
])
