import { postService } from '../../server/modules/posts/container.js'
import { createPostCollectionHandlers } from '../../server/modules/posts/handlers.js'

const handlers = createPostCollectionHandlers(postService)

export const GET = handlers.GET
export const POST = handlers.POST
