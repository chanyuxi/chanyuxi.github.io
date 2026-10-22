import type { PostSummary } from '@shared/contracts/posts'

const postDateFormatter = new Intl.DateTimeFormat('en', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatPostDate(value: null | string) {
  if (!value) return 'Unpublished'

  return postDateFormatter.format(new Date(value))
}

export function postAuthorName(post: PostSummary) {
  return post.author.displayName?.trim() || 'Member'
}
