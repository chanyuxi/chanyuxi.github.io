import eslintJS from '@eslint/js'
import eslintTS from 'typescript-eslint'
import eslintStylistic from '@stylistic/eslint-plugin'
import eslintReact from '@eslint-react/eslint-plugin'
import eslintJson from 'eslint-plugin-jsonc'
import globals from 'globals'

const JSFILES = '**/*.?([cm])js?(x)'
const TSFILES = '**/*.?([cm])ts?(x)'

const JSONFILES = '**/*.{json, json5, jsonc}'

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
  {
    files: [JSFILES, TSFILES],
    extends: [
      eslintStylistic.configs.recommended,
    ],
  },
  {
    files: [JSONFILES],
    extends: [eslintJson.configs['flat/recommended-with-json']],
  },
  {
    files: ['**/package.json'],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          order: [
            'name',
            'version',
            'private',
            'description',
            'keywords',
            'homepage',
            'bugs',
            'repository',
            'funding',
            'license',
            'author',
            'contributors',
            'type',
            'main',
            'module',
            'types',
            'typings',
            'exports',
            'browser',
            'bin',
            'man',
            'files',
            'sideEffects',
            'scripts',
            'dependencies',
            'devDependencies',
            'peerDependencies',
            'peerDependenciesMeta',
            'optionalDependencies',
            'bundledDependencies',
            'engines',
            'os',
            'cpu',
            'publishConfig',
            'babel',
            'eslintConfig',
            'husky',
            'jest',
            'lint-staged',
            'prettier',
            'release',
            'simple-git-hooks',
            'volta',
            '*',
          ],
          pathPattern: '^$',
          allowLineSeparatedGroups: true,
        },
      ],
    },
  },
)

export default config
