import type { PostDraft } from './types'
import type { PostEditor } from '@shared/contracts/posts'

import { PostErrorCode } from '@shared/contracts/posts'
import { useEffect, useReducer, useRef, useState } from 'react'
import { useBlocker, useNavigate, useParams } from 'react-router'

import { ApiError } from '@/api'
import { useAuth } from '@/contexts/auth'
import {
  useCreatePostMutation,
  useDeletePostMutation,
  usePublishPostMutation,
  useUpdatePostMutation,
} from '@/services/posts/mutations'
import { usePostEditorQuery } from '@/services/posts/queries'

import {
  createPostPayload,
  createUpdatePostPayload,
  INITIAL_EDITOR_STATE,
  postEditorReducer,
} from './state'
import { isSameDraft } from './types'

/**
 * Owns the editor's state machine: the local draft, dirty tracking, the
 * navigation blocker, and the save/publish/delete flows.
 */
export function usePostEditorController() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id
  const navigate = useNavigate()
  const { status: authStatus } = useAuth()

  const postQuery = usePostEditorQuery(id ?? '')
  const createMutation = useCreatePostMutation()
  const updateMutation = useUpdatePostMutation(id ?? '')
  const deleteMutation = useDeletePostMutation(id ?? '')
  const publishMutation = usePublishPostMutation()

  const [editor, dispatch] = useReducer(postEditorReducer, INITIAL_EDITOR_STATE)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const bypassBlockerRef = useRef(false)
  const {
    appliedPostId,
    draft,
    errorMessage,
    hasConflict,
    savedDraft,
    status,
    version,
  } = editor

  const dirty = !isSameDraft(draft, savedDraft)
  const blocker = useBlocker(() => dirty && !bypassBlockerRef.current)
  const isSaving = createMutation.isPending || updateMutation.isPending
  const post = postQuery.data
  const isHydrating = Boolean(
    (post && appliedPostId !== post.id)
    || (!id && appliedPostId),
  )

  useEffect(() => {
    if (!post || appliedPostId === post.id) return

    dispatch({ post, type: 'load-server' })
  }, [appliedPostId, post])

  useEffect(() => {
    if (id || appliedPostId === null) return

    dispatch({ type: 'reset' })
  }, [appliedPostId, id])

  useEffect(() => {
    if (!dirty) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [dirty])

  function updateDraft(patch: Partial<PostDraft>) {
    dispatch({ patch, type: 'change-draft' })
  }

  function updateTitle(value: string) {
    dispatch({ type: 'change-title', value })
  }

  function updateSlug(value: string) {
    dispatch({ type: 'change-slug', value })
  }

  async function saveDraft(): Promise<null | PostEditor> {
    dispatch({ type: 'clear-error' })

    if (!draft.title.trim()) {
      dispatch({
        message: 'Add a title before saving.',
        type: 'set-error',
      })
      return null
    }

    try {
      const submitted = draft
      const saved = isNew
        ? await createMutation.mutateAsync(createPostPayload(draft))
        : await updateMutation.mutateAsync(
            createUpdatePostPayload(draft, savedDraft, version),
          )

      // Fields the user edited while the request was in flight stay local;
      // the draft stays dirty for them until the next save.
      dispatch({ post: saved, submitted, type: 'save-succeeded' })

      if (isNew) {
        bypassBlockerRef.current = true
        navigate(`/post/editor/${saved.id}`, { replace: true })
        window.setTimeout(() => {
          bypassBlockerRef.current = false
        }, 0)
      }

      return saved
    }
    catch (error) {
      dispatch({
        conflict: error instanceof ApiError
          && error.code === PostErrorCode.Conflict,
        message: error instanceof Error
          ? error.message
          : 'Unable to save this post. Please try again.',
        type: 'set-error',
      })
      return null
    }
  }

  async function handlePublish() {
    dispatch({ type: 'clear-error' })
    setIsPublishing(true)

    try {
      const saved = await saveDraft()

      if (!saved) return

      const published = await publishMutation.mutateAsync({
        id: saved.id,
        version: saved.version,
      })

      dispatch({ status: published.status, type: 'publish-succeeded' })
      setPublishOpen(false)
      bypassBlockerRef.current = true
      navigate(`/post/${published.slug}`)
      window.setTimeout(() => {
        bypassBlockerRef.current = false
      }, 0)
    }
    catch (error) {
      dispatch({
        message: error instanceof Error
          ? error.message
          : 'Unable to publish this post. Please try again.',
        type: 'set-error',
      })
    }
    finally {
      setIsPublishing(false)
    }
  }

  async function handleSaveDraft() {
    const saved = await saveDraft()

    if (saved) setPublishOpen(false)
  }

  async function handleDelete() {
    if (!id) return

    try {
      await deleteMutation.mutateAsync()
      bypassBlockerRef.current = true
      navigate('/post/mine', { replace: true })
      window.setTimeout(() => {
        bypassBlockerRef.current = false
      }, 0)
    }
    catch (error) {
      dispatch({
        message: error instanceof Error
          ? error.message
          : 'Unable to delete this post. Please try again.',
        type: 'set-error',
      })
    }
  }

  /** Refetches and re-applies server state over the local draft. */
  async function loadLatest() {
    dispatch({ type: 'clear-error' })
    const result = await postQuery.refetch()

    if (result.isSuccess && result.data) {
      dispatch({ post: result.data, type: 'load-server' })
    }
    else {
      // Keep the local draft and the conflict notice; stale cached data
      // must not masquerade as "the latest" after a failed refresh.
      dispatch({
        message: 'Could not load the latest version. Check your connection and try again.',
        type: 'set-error',
      })
    }
  }

  return {
    authStatus,
    blocker,
    deleteOpen,
    detailsOpen,
    draft,
    errorMessage,
    handleDelete,
    handlePublish,
    handleSaveDraft,
    hasConflict,
    id,
    isDeleting: deleteMutation.isPending,
    isHydrating,
    isNew,
    isPublishing,
    isSaving,
    loadLatest,
    postQuery,
    publishOpen,
    setDeleteOpen,
    setDetailsOpen,
    setPublishOpen,
    status,
    updateDraft,
    updateSlug,
    updateTitle,
  }
}
