import type { ApiLogger } from '../http.js'
import type { SiteLikesService } from './service.js'

import {
  incrementSiteLikesRequestSchema,
  MAX_SITE_LIKES_INCREMENT,
  SiteLikesErrorCode,
} from '../../shared/contracts/site-likes.js'
import {
  defineApiHandler,
  parseJsonBody,
  successResponse,
} from '../http.js'

const invalidIncrementMessage
  = `increment must be an integer between 1 and ${MAX_SITE_LIKES_INCREMENT}`

export function createSiteLikesHandlers(
  service: SiteLikesService,
  logger?: ApiLogger,
) {
  const GET = defineApiHandler(
    'site-likes.read',
    async () => successResponse(await service.getSiteLikes()),
    logger,
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
    logger,
  )

  return { GET, POST }
}
