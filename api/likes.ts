import { createSiteLikesHandlers } from '../server/modules/site-likes/handlers.js'
import { createSiteLikesRepository } from '../server/modules/site-likes/repository.js'
import { createSiteLikesService } from '../server/modules/site-likes/service.js'

const repository = createSiteLikesRepository()
const service = createSiteLikesService(repository)
const handlers = createSiteLikesHandlers(service)

export const GET = handlers.GET
export const POST = handlers.POST
