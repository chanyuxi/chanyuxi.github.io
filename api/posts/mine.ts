import { postService } from '../../server/modules/posts/container.js'
import { createPostMineHandlers } from '../../server/modules/posts/handlers.js'

const handlers = createPostMineHandlers(postService)

export const GET = handlers.GET
