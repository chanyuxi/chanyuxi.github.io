import waltz from '@chanyuxi/eslint-waltz'

export default waltz({
  gitignore: true,
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
