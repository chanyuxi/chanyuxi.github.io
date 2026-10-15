import { createChatHandlers } from '../server/modules/chat/handlers.js'
import { createChatService } from '../server/modules/chat/service.js'

const service = createChatService()
const handlers = createChatHandlers(service)

export const POST = handlers.POST
