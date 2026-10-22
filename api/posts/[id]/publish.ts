import { postService } from '../../../server/modules/posts/container.js'
import { createPostPublishHandler } from '../../../server/modules/posts/handlers.js'

const handlers = createPostPublishHandler(postService)

export const POST = handlers.POST
