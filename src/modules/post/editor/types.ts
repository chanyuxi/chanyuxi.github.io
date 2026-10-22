import type { PostEditor } from '@shared/contracts/posts'

import { MAX_POST_TAG_LENGTH, MAX_POST_TAGS } from '@shared/constants/posts'

export interface PostDraft {
  contentMd: string
  description: string
  slug: string
  tags: string
  title: string
}

export const EMPTY_DRAFT: PostDraft = {
  contentMd: '',
  description: '',
  slug: '',
  tags: '',
  title: '',
}

export function draftFromPost(post: PostEditor): PostDraft {
  return {
    contentMd: post.contentMd,
    description: post.description ?? '',
    slug: post.slug,
    tags: post.tags.join(', '),
    title: post.title,
  }
}

export function isSameDraft(left: PostDraft, right: PostDraft) {
  return left.contentMd === right.contentMd
    && left.description === right.description
    && left.slug === right.slug
    && left.tags === right.tags
    && left.title === right.title
}

/**
 * Applies a save response without discarding edits typed while the request
 * was in flight: fields changed since the submitted snapshot win locally.
 */
export function mergeDraftAfterSave(
  current: PostDraft,
  submitted: PostDraft,
  saved: PostEditor,
): PostDraft {
  const server = draftFromPost(saved)

  const pick = <K extends keyof PostDraft>(key: K): PostDraft[K] =>
    current[key] === submitted[key] ? server[key] : current[key]

  return {
    contentMd: pick('contentMd'),
    description: pick('description'),
    slug: pick('slug'),
    tags: pick('tags'),
    title: pick('title'),
  }
}

/**
 * Splits the comma-separated tag input, mirroring the server limits so an
 * over-long list is shaped here instead of rejected after a save.
 */
export function parseTags(value: string) {
  return [...new Set(
    value
      .split(',')
      .map(tag => tag.trim().slice(0, MAX_POST_TAG_LENGTH))
      .filter(Boolean),
  )].slice(0, MAX_POST_TAGS)
}
