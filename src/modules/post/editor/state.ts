import type { PostDraft } from './types'
import type { PostStatus } from '@shared/constants/posts'
import type {
  CreatePostRequest,
  PostEditor,
  UpdatePostRequest,
} from '@shared/contracts/posts'

import { toPostSlug } from '@shared/utils/post-slug'

import {
  draftFromPost,
  EMPTY_DRAFT,
  mergeDraftAfterSave,
  parseTags,
} from './types'

export interface PostEditorState {
  appliedPostId: null | string
  draft: PostDraft
  errorMessage: null | string
  hasConflict: boolean
  savedDraft: PostDraft
  slugTouched: boolean
  status: PostStatus
  version: number
}

export const INITIAL_EDITOR_STATE: PostEditorState = {
  appliedPostId: null,
  draft: EMPTY_DRAFT,
  errorMessage: null,
  hasConflict: false,
  savedDraft: EMPTY_DRAFT,
  slugTouched: false,
  status: 'draft',
  version: 0,
}

type PostEditorAction
  = | { conflict?: boolean, message: string, type: 'set-error' }
    | { patch: Partial<PostDraft>, type: 'change-draft' }
    | { post: PostEditor, submitted: PostDraft, type: 'save-succeeded' }
    | { post: PostEditor, type: 'load-server' }
    | { status: PostStatus, type: 'publish-succeeded' }
    | { type: 'change-slug', value: string }
    | { type: 'change-title', value: string }
    | { type: 'clear-error' }
    | { type: 'reset' }

export function createPostPayload(draft: PostDraft): CreatePostRequest {
  return {
    contentMd: draft.contentMd,
    description: draft.description.trim() || undefined,
    slug: toPostSlug(draft.slug || draft.title),
    tags: parseTags(draft.tags),
    title: draft.title.trim(),
  }
}

export function createUpdatePostPayload(
  draft: PostDraft,
  savedDraft: PostDraft,
  version: number,
): UpdatePostRequest {
  const payload: UpdatePostRequest = { version }
  const description = draft.description.trim() || null
  const savedDescription = savedDraft.description.trim() || null
  const slug = toPostSlug(draft.slug || draft.title)
  const tags = parseTags(draft.tags)
  const savedTags = parseTags(savedDraft.tags)
  const title = draft.title.trim()

  if (draft.contentMd !== savedDraft.contentMd) payload.contentMd = draft.contentMd
  if (description !== savedDescription) payload.description = description
  if (slug !== savedDraft.slug) payload.slug = slug
  if (!areEqual(tags, savedTags)) payload.tags = tags
  if (title !== savedDraft.title) payload.title = title

  return payload
}

export function postEditorReducer(
  state: PostEditorState,
  action: PostEditorAction,
): PostEditorState {
  switch (action.type) {
    case 'change-draft':
      return { ...state, draft: { ...state.draft, ...action.patch } }
    case 'change-slug':
      return {
        ...state,
        draft: { ...state.draft, slug: action.value },
        slugTouched: true,
      }
    case 'change-title':
      return {
        ...state,
        draft: {
          ...state.draft,
          slug: state.slugTouched
            ? state.draft.slug
            : toPostSlug(action.value),
          title: action.value,
        },
      }
    case 'clear-error':
      return { ...state, errorMessage: null }
    case 'load-server': {
      const server = draftFromPost(action.post)

      return {
        ...state,
        appliedPostId: action.post.id,
        draft: server,
        errorMessage: null,
        hasConflict: false,
        savedDraft: server,
        slugTouched: true,
        status: action.post.status,
        version: action.post.version,
      }
    }
    case 'publish-succeeded':
      return { ...state, status: action.status }
    case 'reset':
      return INITIAL_EDITOR_STATE
    case 'save-succeeded': {
      const server = draftFromPost(action.post)

      return {
        ...state,
        appliedPostId: action.post.id,
        draft: mergeDraftAfterSave(state.draft, action.submitted, action.post),
        errorMessage: null,
        hasConflict: false,
        savedDraft: server,
        slugTouched: true,
        status: action.post.status,
        version: action.post.version,
      }
    }
    case 'set-error':
      return {
        ...state,
        errorMessage: action.message,
        hasConflict: action.conflict ?? state.hasConflict,
      }
  }
}

function areEqual(left: string[], right: string[]) {
  return left.length === right.length
    && left.every((value, index) => value === right[index])
}
