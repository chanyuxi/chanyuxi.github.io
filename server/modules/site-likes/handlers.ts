import type { SiteLikesService } from './service.js'

import { MAX_SITE_LIKES_INCREMENT } from '../../../shared/constants/site-likes.js'
import {
  incrementSiteLikesRequestSchema,
  SiteLikesErrorCode,
} from '../../../shared/contracts/site-likes.js'
import {
  defineApiHandler,
  parseJsonBody,
  successResponse,
} from '../../core/http.js'

const invalidIncrementMessage
  = `increment must be an integer between 1 and ${MAX_SITE_LIKES_INCREMENT}`

// The count is public and identical for everyone, so browsers and the Vercel
// edge may serve it briefly instead of hitting the database on every visit.
// The increment mutation returns the authoritative count, so a short window
// of staleness only affects the initially displayed value.
const COUNT_CACHE_CONTROL = 'public, max-age=30, stale-while-revalidate=60'

export function createSiteLikesHandlers(service: SiteLikesService) {
  const GET = defineApiHandler(
    'site-likes.read',
    async () => successResponse(
      await service.getSiteLikes(),
      COUNT_CACHE_CONTROL,
    ),
  )

  const POST = defineApiHandler(
    'site-likes.increment',
    async (request) => {
      const payload = await parseJsonBody(
        request,
        incrementSiteLikesRequestSchema,
        {
          code: SiteLikesErrorCode.InvalidIncrement,
          message: invalidIncrementMessage,
        },
      )

      return successResponse(
        await service.incrementSiteLikes(payload.increment),
      )
    },
  )

  return { GET, POST }
}
