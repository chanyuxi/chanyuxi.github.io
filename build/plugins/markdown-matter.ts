import type { Plugin } from 'vite'

import { readFile } from 'node:fs/promises'

import matter from 'gray-matter'

export function markdownMatterPlugin(): Plugin {
  return {
    async load(id) {
      const [filepath, ...queryParts] = id.split('?')

      if (queryParts.length > 0 || !filepath.endsWith('.md')) {
        return null
      }

      const { content, data } = matter(await readFile(filepath, 'utf8'))

      return `export default ${JSON.stringify({
        content: content.trim(),
        frontmatter: normalizeMarkdownData(data),
      })}`
    },
    name: 'markdown-matter',
  }
}

function normalizeMarkdownData(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  if (Array.isArray(value)) {
    return value.map(normalizeMarkdownData)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        normalizeMarkdownData(item),
      ]),
    )
  }

  return value
}
