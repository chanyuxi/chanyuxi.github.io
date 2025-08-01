import waltz from '@chanyuxi/eslint-waltz'

export default waltz({
  gitignore: true,
  js: { globals: ['browser'] },
  ts: true,
  imports: true,
  react: true,
})
