import waltz from '@chanyuxi/eslint-waltz'

export default waltz({
  gitignore: true,
  globalIgnores: ['src/libs/cn-tables.ts'],
  react: true,
  tailwindcss: {
    settings: {
      tailwindcss: {
        cssConfigPath: 'src/index.css',
      },
    },
  },
  ts: true,
})
