import { z } from 'zod'

import {
  MAX_CHAT_CONTEXT_MESSAGES,
  MAX_CHAT_MESSAGE_LENGTH,
} from '../constants/chat.js'

export const ChatErrorCode = {
  InvalidRequest: 'INVALID_CHAT_REQUEST',
  Unavailable: 'CHAT_UNAVAILABLE',
  UpstreamFailed: 'AI_UPSTREAM_FAILED',
} as const

export const chatTurnSchema = z.object({
  content: z.string().trim().min(1).max(64_000),
  role: z.enum(['user', 'assistant']),
})

export const chatRequestSchema = z.object({
  messages: z.array(chatTurnSchema).min(1).max(MAX_CHAT_CONTEXT_MESSAGES),
}).refine(({ messages }) =>
  messages.at(-1)?.role === 'user'
  && messages.every((message, index) =>
    message.role === (index % 2 === 0 ? 'user' : 'assistant')
    && (
      message.role !== 'user'
      || message.content.length <= MAX_CHAT_MESSAGE_LENGTH
    ),
  ),
)

export type ChatRequest = z.infer<typeof chatRequestSchema>
export type ChatTurn = z.infer<typeof chatTurnSchema>
