import { POST_PAGE_SIZE } from '@shared/constants/posts'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { useAuth } from '@/contexts/auth'

import { postQueryKeys } from './key'
import {
  requestMyPosts,
  requestPost,
  requestPostEditor,
  requestPosts,
} from './request'

/** Paginated variant of "my posts" for the shared infinite-scroll trigger. */
export function useMyPostsInfiniteQuery() {
  const { user } = useAuth()

  return useInfiniteQuery({
    enabled: Boolean(user),
    getNextPageParam: nextPageOffset,
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) => requestMyPosts(pageParam, signal),
    queryKey: postQueryKeys.minePages(user?.id ?? 'anonymous'),
    staleTime: 10_000,
  })
}

export function usePostEditorQuery(id: string) {
  const { user } = useAuth()

  return useQuery({
    enabled: Boolean(id) && Boolean(user),
    queryFn: ({ signal }) => requestPostEditor(id, signal),
    queryKey: postQueryKeys.editor(user?.id ?? 'anonymous', id),
  })
}

export function usePostQuery(slug: string) {
  return useQuery({
    enabled: Boolean(slug),
    queryFn: ({ signal }) => requestPost(slug, signal),
    queryKey: postQueryKeys.detail(slug),
    staleTime: 30_000,
  })
}

/** Paginated public feed for the shared infinite-scroll trigger. */
export function usePostsInfiniteQuery(search = '') {
  return useInfiniteQuery({
    getNextPageParam: nextPageOffset,
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) => requestPosts(pageParam, search, signal),
    queryKey: postQueryKeys.listPages(search),
    staleTime: 30_000,
  })
}

function nextPageOffset(lastPage: { items: unknown[] }, allPages: Array<{ items: unknown[] }>) {
  if (lastPage.items.length < POST_PAGE_SIZE) {
    return undefined
  }

  return allPages.reduce((total, page) => total + page.items.length, 0)
}
