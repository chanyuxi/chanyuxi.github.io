import type { ChatService } from './service.js'

import { ChatErrorCode, chatRequestSchema } from '../../../shared/contracts/chat.js'
import {
  defineApiHandler,
  HttpError,
  parseJsonBody,
} from '../../core/http.js'

import { ChatUnavailableError } from './service.js'

const invalidChatRequestMessage = 'Invalid chat messages'
const chatUnavailableMessage = 'AI Chat is currently unavailable'
const upstreamFailedMessage = 'AI request failed'

export function createChatHandlers(service: ChatService) {
  const POST = defineApiHandler(
    'chat.stream',
    async (request) => {
      const payload = await parseJsonBody(request, chatRequestSchema, {
        code: ChatErrorCode.InvalidRequest,
        message: invalidChatRequestMessage,
      })

      try {
        const stream = await service.streamChat(
          payload.messages,
          request.signal,
        )

        return new Response(stream, {
          headers: {
            'Cache-Control': 'no-store, no-transform',
            'Content-Type': 'application/x-ndjson; charset=utf-8',
            'X-Accel-Buffering': 'no',
          },
        })
      }
      catch (error) {
        if (error instanceof ChatUnavailableError) {
          throw new HttpError(
            503,
            ChatErrorCode.Unavailable,
            chatUnavailableMessage,
          )
        }

        console.error('AI request failed', error)
        throw new HttpError(502, ChatErrorCode.UpstreamFailed, upstreamFailedMessage)
      }
    },
  )

  return { POST }
}
