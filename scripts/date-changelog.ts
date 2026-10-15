import { execFile } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const changelogUrl = new URL('../CHANGELOG.md', import.meta.url)
const projectRoot = fileURLToPath(new URL('..', import.meta.url))

/**
 * Section order used for every release, following Keep a Changelog.
 * @see {@link https://keepachangelog.com/en/1.1.0/}
 */
const sectionOrder = ['Added', 'Changed', 'Fixed', 'Removed']

/**
 * Marker emitted by `scripts/changelog/index.ts` for each release line, before
 * the entries are grouped under their final headings.
 */
const markerPrefix = '%%changelog:'
const markerPattern = new RegExp(`^- ${markerPrefix}(\\w+)%%\\s+(.*)$`)

/**
 * Headings changesets wraps release lines in. They carry no meaning once the
 * entries are regrouped, so they are dropped from generated releases.
 */
const changesetsHeadingPattern = /^### (?:Major|Minor|Patch) Changes\s*$/

const versionHeadingPattern = /^## (v?\d+\.\d+\.\d+(?:-[\w.-]+)?)(?:\s+-\s+(\d{4}-\d{2}-\d{2}))?\s*$/

/**
 * Resolve the commit date for a release so the heading date reflects the real
 * release instead of whenever this script happens to run.
 */
async function toReleaseDate(version: string, fallback: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['log', '-1', '--format=%cs', '--grep', `release v${version.replace(/^v/, '')}`],
      { cwd: projectRoot },
    )

    const date = stdout.trim()

    return date || fallback
  }
  catch {
    return fallback
  }
}

const changelog = await readFile(changelogUrl, 'utf8')
// Work on LF-normalized text and restore the file's own line endings on write,
// so committing from a CRLF checkout keeps the diff limited to real changes.
const eol = changelog.includes('\r\n') ? '\r\n' : '\n'
const normalizedChangelog = changelog.replaceAll('\r\n', '\n')
const lines = normalizedChangelog.split('\n')
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())

type Release = {
  body: string[]
  date: string | undefined
  heading: string
  version: string
}

const releases: Release[] = []
const preamble: string[] = []
let current: Release | undefined

for (const line of lines) {
  const heading = versionHeadingPattern.exec(line)

  if (heading) {
    current = {
      body: [],
      date: heading[2],
      heading: line,
      version: heading[1]!,
    }
    releases.push(current)
    continue
  }

  if (current) {
    current.body.push(line)
  }
  else {
    preamble.push(line)
  }
}

/**
 * Group marked lines into ordered sections and drop the marks and the
 * changesets wrapper heading. Unmarked content is preserved ahead of the
 * sections so hand-written notes are not lost.
 */
function renderBody(body: string[]): string[] {
  const marked = body.filter(line => markerPattern.test(line))

  // Releases without marked entries predate this pipeline; leave them as-is.
  if (marked.length === 0) {
    return body
  }

  const sections = new Map<string, string[]>()
  const preserved: string[] = []

  for (const line of body) {
    const entry = markerPattern.exec(line)

    if (!entry) {
      if (line.trim() && !changesetsHeadingPattern.test(line)) {
        preserved.push(line)
      }

      continue
    }

    const [, rawTitle, text] = entry
    const title = rawTitle!
    const entries = sections.get(title) ?? []

    entries.push(text!.trim())
    sections.set(title, entries)
  }

  const rendered: string[] = []

  if (preserved.length > 0) {
    rendered.push(...preserved, '')
  }

  const headings = [
    ...sectionOrder.filter(title => sections.has(title)),
    ...[...sections.keys()].filter(title => !sectionOrder.includes(title)),
  ]

  headings.forEach((title, index) => {
    if (index > 0) {
      rendered.push('')
    }

    rendered.push(`### ${title}`, '')

    for (const entry of sections.get(title)!) {
      rendered.push(`- ${entry}`)
    }
  })

  return rendered
}

const updated = await Promise.all(releases.map(async (release) => {
  const date = release.date ?? await toReleaseDate(release.version, today)
  const heading = `## ${release.version} - ${date}`
  const body = renderBody(release.body)

  // Trim trailing blank lines so releases stay separated by a single blank line.
  while (body.length > 0 && body[body.length - 1] === '') {
    body.pop()
  }

  return {
    body,
    heading,
    version: release.version,
  }
}))

const blocks = updated.map(({ body, heading }) => [
  heading,
  '',
  ...body,
])

const datedChangelog = [
  ...preamble,
  ...blocks.flatMap((block, index) => (index > 0 ? ['', ...block] : block)),
].join('\n').replace(/\n{3,}/g, '\n\n').replace(/\n*$/, '\n')

if (datedChangelog !== normalizedChangelog) {
  await writeFile(changelogUrl, datedChangelog.replaceAll('\n', eol))
  console.log('Updated CHANGELOG.md headings and grouped release entries.')
}
else {
  console.log('CHANGELOG.md already matches the generated format.')
}
