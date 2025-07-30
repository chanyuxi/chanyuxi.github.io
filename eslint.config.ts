import eslintJS from '@eslint/js'
import eslintTS from 'typescript-eslint'
import eslintStylistic from '@stylistic/eslint-plugin'
import eslintReact from '@eslint-react/eslint-plugin'
import globals from 'globals'

const JSFILES = '**/*.?([cm])js?(x)'
const TSFILES = '**/*.?([cm])ts?(x)'

const config = eslintTS.config(
  {
    name: 'globals/setup',
    files: [JSFILES, TSFILES],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: [JSFILES, TSFILES],
    rules: eslintJS.configs.recommended.rules,
  },
  {
    files: [TSFILES],
    extends: [
      eslintTS.configs.recommended,
      eslintReact.configs['recommended-typescript'],
    ],
  },
  eslintStylistic.configs.recommended,
)

export default config
