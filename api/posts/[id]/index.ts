import { postService } from '../../../server/modules/posts/container.js'
import { createPostItemHandlers } from '../../../server/modules/posts/handlers.js'

const handlers = createPostItemHandlers(postService)

export const DELETE = handlers.DELETE
export const GET = handlers.GET
export const PATCH = handlers.PATCH
