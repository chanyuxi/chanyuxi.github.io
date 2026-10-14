import { z } from 'zod'

import { ChatUnavailableError, streamChat } from '../server/chat.js'
import {
  MAX_CHAT_CONTEXT_MESSAGES,
  MAX_CHAT_MESSAGE_LENGTH,
} from '../shared/constants/chat.js'

const responseHeaders = { 'Cache-Control': 'no-store' }
// TODO: If the schema already handles validation, is it necessary
// for `streamChat` to check the context length again? Or should
// we remove the check here?
const requestSchema = z.object({
  messages: z.array(z.object({
    content: z.string().trim().min(1).max(64_000),
    role: z.enum(['user', 'assistant']),
  })).min(1).max(MAX_CHAT_CONTEXT_MESSAGES),
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

export async function POST(request: Request): Promise<Response> {
  let body: unknown

  try {
    body = await request.json()
  }
  catch {
    return Response.json(
      { error: 'Invalid JSON request body' },
      { headers: responseHeaders, status: 400 },
    )
  }

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid chat messages' },
      { headers: responseHeaders, status: 400 },
    )
  }

  try {
    const stream = await streamChat(parsed.data.messages, request.signal)
    return new Response(stream, {
      headers: {
        'Cache-Control': 'no-store, no-transform',
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'X-Accel-Buffering': 'no',
      },
    })
  }
  catch (error) {
    console.error('AI request failed', error)
    const unavailable = error instanceof ChatUnavailableError
    return Response.json(
      { error: unavailable ? 'AI Chat is currently unavailable' : 'AI request failed' },
      { headers: responseHeaders, status: unavailable ? 503 : 502 },
    )
  }
}
