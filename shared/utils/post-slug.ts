import { POST_SLUG_MAX_LENGTH } from '../constants/posts.js'

/**
 * Produces a stable, URL-safe-enough slug. Unicode letters are preserved so
 * Chinese titles still get a readable route; separators collapse to hyphens.
 */
export function toPostSlug(value: string) {
  const normalized = value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+/, '')

  // Truncate by code points so surrogate pairs (emoji, rare CJK) survive
  // the cut instead of leaving a lone half behind in the slug.
  const slug = Array.from(normalized)
    .slice(0, POST_SLUG_MAX_LENGTH)
    .join('')
    .replace(/-+$/, '')

  return slug || 'post'
}
