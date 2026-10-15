import type { UserProfileService } from './service.js'

import { requireVerifiedUser } from '../../core/auth.js'
import { defineApiHandler, successResponse } from '../../core/http.js'

export function createUserProfileHandlers(service: UserProfileService) {
  const GET = defineApiHandler(
    'me.read',
    async (request) => {
      const user = await requireVerifiedUser(request)
      const profile = await service.getOrCreateProfile(user.id)

      return successResponse({ ...user, profile })
    },
  )

  return { GET }
}
