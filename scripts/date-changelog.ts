import { readFile, writeFile } from 'node:fs/promises'

const changelogUrl = new URL('../CHANGELOG.md', import.meta.url)
const changelog = await readFile(changelogUrl, 'utf8')
const releaseDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
}).format(new Date())

const datedChangelog = changelog.replace(
  /^## (v?\d+\.\d+\.\d+(?:-[\w.-]+)?)$/gm,
  (_match: string, version: string) => `## ${version} - ${releaseDate}`,
)

if (datedChangelog !== changelog) {
  await writeFile(changelogUrl, datedChangelog)
  console.log(`Added ${releaseDate} to new CHANGELOG.md release headings.`)
}
else {
  console.log('CHANGELOG.md already contains dates for every release.')
}
