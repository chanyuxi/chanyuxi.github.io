import waltz from '@chanyuxi/eslint-waltz'

export default waltz({
  js: { globals: ['browser'] },
  ts: true,
  gitignore: true,
})
