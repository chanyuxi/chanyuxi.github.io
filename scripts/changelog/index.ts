import type { NewChangesetWithCommit } from '@changesets/types'

/**
 * Section headings supported by the changelog, in the order they appear.
 * A changeset opts into one of these by prefixing its summary with
 * `<kind>: `; entries without a recognized prefix are treated as changes so
 * no entry is ever dropped.
 * @see {@link https://keepachangelog.com/en/1.1.0/}
 */
const sectionHeadings = ['added', 'changed', 'fixed', 'removed'] as const

type SectionKind = typeof sectionHeadings[number]

/**
 * Marker used in the intermediate release line. It is not part of the final
 * document: `scripts/date-changelog.ts` reads it, groups entries under real
 * `### Added` / `### Changed` / `### Fixed` headings, and strips it.
 */
const markerPrefix = '%%changelog:'

const sectionTitle: Record<SectionKind, string> = {
  added: 'Added',
  changed: 'Changed',
  fixed: 'Fixed',
  removed: 'Removed',
}

const prefixPattern = new RegExp(`^(?:${sectionHeadings.join('|')})\\s*:\\s*`, 'i')

/**
 * Internal dependency bumps carry no user-facing prose, and this project ships
 * as a single package, so there is nothing to report.
 */
export function getDependencyReleaseLine(): string {
  return ''
}

/**
 * Generate the release line for a single changeset. Changesets wraps every
 * release line under its own `### Minor Changes` heading, so the entry is
 * emitted as a marked list item instead; `scripts/date-changelog.ts` turns the
 * markers into the final Keep a Changelog sections.
 */
export function getReleaseLine(changeset: NewChangesetWithCommit): string {
  const kind = toSection(changeset.summary)
  const entry = toEntry(changeset.summary)

  if (!entry) {
    return ''
  }

  return `- ${markerPrefix}${sectionTitle[kind]}%% ${entry}`
}

/**
 * Strip the `<kind>: ` prefix so the entry reads naturally under its heading.
 */
function toEntry(summary: string): string {
  return summary.trim().replace(prefixPattern, '').trim()
}

/**
 * Read the section kind from a changeset summary's `<kind>: ` prefix.
 */
function toSection(summary: string): SectionKind {
  const [firstLine = ''] = summary.trim().split(/\r?\n/)
  const matched = prefixPattern.exec(firstLine)?.[0]

  if (!matched) {
    return 'changed'
  }

  return matched.slice(0, matched.indexOf(':')).trim().toLowerCase() as SectionKind
}

export default {
  getDependencyReleaseLine,
  getReleaseLine,
}
