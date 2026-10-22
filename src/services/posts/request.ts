import type {
  CreatePostRequest,
  PostList,
  UpdatePostRequest,
} from '@shared/contracts/posts'

import {
  createPostRequestSchema,
  deletePostResponseSchema,
  postDetailSchema,
  postEditorSchema,
  postListSchema,
  postSummarySchema,
  publishPostRequestSchema,
  updatePostRequestSchema,
} from '@shared/contracts/posts'

import { get, post, request } from '@/api'

export function createPost(data: CreatePostRequest) {
  return post('/api/posts', data, {
    requestSchema: createPostRequestSchema,
    requireAuth: true,
    responseSchema: postEditorSchema,
  })
}

export function deletePost(id: string) {
  return request({
    method: 'DELETE',
    requireAuth: true,
    responseSchema: deletePostResponseSchema,
    url: `/api/posts/${id}`,
  })
}

export function publishPost(id: string, version: number) {
  return post(
    `/api/posts/${id}/publish`,
    { version },
    {
      requestSchema: publishPostRequestSchema,
      requireAuth: true,
      responseSchema: postSummarySchema,
    },
  )
}

export function requestMyPosts(offset = 0, signal?: AbortSignal): Promise<PostList> {
  return get('/api/posts/mine', {
    params: { offset },
    requireAuth: true,
    responseSchema: postListSchema,
    signal,
  })
}

export function requestPost(slug: string, signal?: AbortSignal) {
  return get(`/api/posts/by-slug/${encodeURIComponent(slug)}`, {
    responseSchema: postDetailSchema,
    signal,
  })
}

export function requestPostEditor(id: string, signal?: AbortSignal) {
  return get(`/api/posts/${id}`, {
    requireAuth: true,
    responseSchema: postEditorSchema,
    signal,
  })
}

export function requestPosts(
  offset = 0,
  search = '',
  signal?: AbortSignal,
): Promise<PostList> {
  return get('/api/posts', {
    params: { offset, search: search || undefined },
    responseSchema: postListSchema,
    signal,
  })
}

export function updatePost(id: string, data: UpdatePostRequest) {
  return request({
    data,
    method: 'PATCH',
    requestSchema: updatePostRequestSchema,
    requireAuth: true,
    responseSchema: postEditorSchema,
    url: `/api/posts/${id}`,
  })
}
