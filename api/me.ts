import { requireVerifiedUser } from '../server/auth.js'
import { defineApiHandler, successResponse } from '../server/http.js'

export const GET = defineApiHandler(
  'me.read',
  async request => successResponse(await requireVerifiedUser(request)),
)
