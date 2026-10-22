import { postService } from '../../../server/modules/posts/container.js'
import { createPostPublicHandlers } from '../../../server/modules/posts/handlers.js'

const handlers = createPostPublicHandlers(postService)

export const GET = handlers.GET
