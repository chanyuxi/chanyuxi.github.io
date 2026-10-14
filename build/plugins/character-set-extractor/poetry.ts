import { characterSetExtractor } from './index'

const POETRY_PUNCTUATION = '，。！？；：、（）「」『』【】《》〈〉“”‘’…——·～'

export const poetryCharacterSetPlugin = characterSetExtractor([
  {
    characters: POETRY_PUNCTUATION,
    detect: [
      'src/modules/poetries/assets/mds',
      'src/modules/poetries/constants.ts',
    ],
    output: 'src/modules/poetries/assets/fonts/MaShanZheng-Regular.woff2',
    source: 'scripts/assets/MaShanZheng-Regular.ttf',
  },
  {
    characters: POETRY_PUNCTUATION,
    detect: [
      'src/modules/poetries/constants.ts',
      {
        extract: 'frontmatter',
        path: 'src/modules/poetries/assets/mds',
      },
    ],
    output: 'src/modules/poetries/assets/fonts/MaShanZheng-Display.woff2',
    source: 'scripts/assets/MaShanZheng-Regular.ttf',
  },
])
