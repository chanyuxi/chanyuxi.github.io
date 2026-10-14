import { z } from 'zod'

import { MAX_SITE_LIKES_INCREMENT } from '../constants/site-likes.js'

export const SiteLikesErrorCode = {
  InvalidIncrement: 'INVALID_INCREMENT',
} as const

export const incrementSiteLikesRequestSchema = z.object({
  increment: z.number().int().min(1).max(MAX_SITE_LIKES_INCREMENT),
})

export const siteLikesSchema = z.object({
  count: z.number().int().nonnegative(),
})

export type IncrementSiteLikesRequest = z.infer<
  typeof incrementSiteLikesRequestSchema
>

export type SiteLikes = z.infer<typeof siteLikesSchema>
