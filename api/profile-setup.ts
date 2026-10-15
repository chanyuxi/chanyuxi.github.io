import { createUserProfileHandlers } from '../server/modules/user-profiles/handlers.js'
import { createUserProfileRepository } from '../server/modules/user-profiles/repository.js'
import { createUserProfileService } from '../server/modules/user-profiles/service.js'

const repository = createUserProfileRepository()
const service = createUserProfileService(repository)
const handlers = createUserProfileHandlers(service)

export const POST = handlers.POST
