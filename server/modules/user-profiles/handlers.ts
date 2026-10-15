import type { UserProfileService } from './service.js'

import { ProfileSetupErrorCode, profileSetupRequestSchema } from '../../../shared/contracts/auth.js'
import { requireVerifiedUser } from '../../core/auth.js'
import { defineApiHandler, parseJsonBody, successResponse } from '../../core/http.js'

export function createUserProfileHandlers(service: UserProfileService) {
  const GET = defineApiHandler(
    'me.read',
    async (request) => {
      const user = await requireVerifiedUser(request)
      const profile = await service.getOrCreateProfile(user.id)

      return successResponse({ ...user, profile })
    },
  )

  // Completes the one-time Profile Setup flow. Responds with the same `Me`
  // shape as GET /api/me so the client can swap it into its query cache.
  const POST = defineApiHandler(
    'profile-setup.complete',
    async (request) => {
      const user = await requireVerifiedUser(request)
      const body = await parseJsonBody(
        request,
        profileSetupRequestSchema,
        {
          code: ProfileSetupErrorCode.InvalidRequest,
          message: 'The profile setup request has an invalid format',
        },
      )
      const profile = await service.completeSetup(user.id, body)

      return successResponse({ ...user, profile })
    },
  )

  return { GET, POST }
}
