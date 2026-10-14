import { requireVerifiedUser } from '../server/auth.js'
import { defineApiHandler, successResponse } from '../server/http.js'
import { createUserProfileRepository } from '../server/user-profiles/repository.js'
import { createUserProfileService } from '../server/user-profiles/service.js'

const repository = createUserProfileRepository()
const service = createUserProfileService(repository)

export const GET = defineApiHandler(
  'me.read',
  async (request) => {
    const user = await requireVerifiedUser(request)
    const profile = await service.getOrCreateProfile(user.id)

    return successResponse({ ...user, profile })
  },
)
