import { createSiteLikesHandlers } from '../server/site-likes/handlers'
import { createSiteLikesRepository } from '../server/site-likes/repository'
import { createSiteLikesService } from '../server/site-likes/service'

const repository = createSiteLikesRepository()
const service = createSiteLikesService(repository)
const handlers = createSiteLikesHandlers(service)

export const GET = handlers.GET
export const POST = handlers.POST
