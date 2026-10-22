import type {
  CreatePostRequest,
  PostEditor,
  UpdatePostRequest,
} from '@shared/contracts/posts'
import type { QueryClient } from '@tanstack/react-query'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/contexts/auth'

import { postMutationKeys, postQueryKeys } from './key'
import {
  createPost,
  deletePost,
  publishPost,
  updatePost,
} from './request'

export function useCreatePostMutation() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    mutationKey: postMutationKeys.create(),
    onSuccess: (post) => {
      if (user) {
        queryClient.setQueryData(postQueryKeys.editor(user.id, post.id), post)
        invalidateMine(queryClient, user.id)
      }
    },
  })
}

export function useDeletePostMutation(id: string) {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: () => deletePost(id),
    mutationKey: postMutationKeys.delete(id),
    onSuccess: () => {
      if (!user) return

      const editorKey = postQueryKeys.editor(user.id, id)
      const previous = queryClient.getQueryData<PostEditor>(editorKey)

      queryClient.removeQueries({ queryKey: editorKey })
      invalidateMine(queryClient, user.id)

      if (previous?.status === 'published') {
        invalidatePublished(queryClient, previous.slug)
      }
    },
  })
}

export function usePublishPostMutation() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ id, version }: { id: string, version: number }) =>
      publishPost(id, version),
    mutationKey: postMutationKeys.publish(),
    onSuccess: (post, variables) => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: postQueryKeys.editor(user.id, variables.id),
        })
        invalidateMine(queryClient, user.id)
      }

      invalidatePublished(queryClient, post.slug)
    },
  })
}

export function useUpdatePostMutation(id: string) {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => updatePost(id, data),
    mutationKey: postMutationKeys.update(id),
    onSuccess: (post) => {
      if (user) {
        const editorKey = postQueryKeys.editor(user.id, post.id)
        const previous = queryClient.getQueryData<PostEditor>(editorKey)

        queryClient.setQueryData(editorKey, post)
        invalidateMine(queryClient, user.id)

        if (previous?.slug !== post.slug && previous?.status === 'published') {
          queryClient.removeQueries({ queryKey: postQueryKeys.detail(previous.slug) })
        }
      }

      if (post.status === 'published') {
        invalidatePublished(queryClient, post.slug)
      }
    },
  })
}

function invalidateMine(queryClient: QueryClient, userId: string) {
  void queryClient.invalidateQueries({
    queryKey: postQueryKeys.minePages(userId),
  })
}

function invalidatePublished(queryClient: QueryClient, slug: string) {
  void queryClient.invalidateQueries({ queryKey: postQueryKeys.list() })
  void queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(slug) })
}
