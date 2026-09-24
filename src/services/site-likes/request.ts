import {
  incrementSiteLikesRequestSchema,
  siteLikesSchema,
} from '@shared/contracts/site-likes'

import { get, post } from '@/api'

export async function incrementSiteLikes(increment: number) {
  return post(
    '/api/likes',
    { increment },
    {
      adapter: 'fetch',
      fetchOptions: { keepalive: true },
      requestSchema: incrementSiteLikesRequestSchema,
      responseSchema: siteLikesSchema,
    },
  )
}

export async function requestSiteLikes(signal?: AbortSignal) {
  return get('/api/likes', { responseSchema: siteLikesSchema, signal })
}
