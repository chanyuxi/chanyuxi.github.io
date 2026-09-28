import type { Plugin } from 'vite'

import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

import matter from 'gray-matter'

import { compileMarkdown } from './compile'
import { normalizeMarkdownData } from './normalize-data'

export function markdownMatterPlugin(): Plugin {
  return {
    async load(id) {
      const [filepath, ...queryParts] = id.split('?')

      if (!filepath.endsWith('.md')) {
        return null
      }

      const query = new URLSearchParams(queryParts.join('?'))
      const frontmatterOnly = query.has('frontmatter')
      const contentOnly = query.has('content')

      if (queryParts.length > 0 && !frontmatterOnly && !contentOnly) {
        return null
      }

      const { content: markdown, data } = matter(await readFile(filepath, 'utf8'))
      const frontmatter = normalizeMarkdownData(data)

      if (frontmatterOnly) {
        return `export default ${JSON.stringify(frontmatter)}`
      }

      const content = await compileMarkdown(markdown, {
        changelog: basename(filepath) === 'CHANGELOG.md',
      })

      if (contentOnly) {
        return `export default ${JSON.stringify(content)}`
      }

      return [
        `export const content = ${JSON.stringify(content)}`,
        `export const frontmatter = ${JSON.stringify(frontmatter)}`,
        'export default { content, frontmatter }',
      ].join('\n')
    },
    name: 'markdown-matter',
  }
}
