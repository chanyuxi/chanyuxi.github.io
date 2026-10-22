export const POST_STATUSES = ['draft', 'published'] as const

// These are static segments under /post, so a post using one of them would
// be unreachable. The server suffixes them instead of rejecting the save.
export const RESERVED_POST_SLUGS = new Set(['editor', 'entrance', 'mine'])

export const MAX_POST_CONTENT_LENGTH = 200_000
export const MAX_POST_DESCRIPTION_LENGTH = 400
export const MAX_POST_SEARCH_LENGTH = 80
export const MAX_POST_TAG_LENGTH = 24
export const MAX_POST_TAGS = 8
export const MAX_POST_TITLE_LENGTH = 160
// Abuse ceiling: any verified user can keep this many posts before the
// create endpoint starts rejecting new ones.
export const MAX_POSTS_PER_USER = 100
export const POST_PAGE_SIZE = 20
export const POST_SLUG_MAX_LENGTH = 80

export type PostStatus = (typeof POST_STATUSES)[number]
