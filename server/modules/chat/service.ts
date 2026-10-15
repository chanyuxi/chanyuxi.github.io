import type { ChatTurn } from '../../../shared/contracts/chat.js'

import OpenAI from 'openai'

import { MAX_CHAT_CONTEXT_MESSAGES } from '../../../shared/constants/chat.js'
import { optionalEnv } from '../../core/env.js'

import { toChatStream } from './stream.js'

const SYSTEM_PROMPT = [
  'You are a helpful assistant. Answer clearly in plain text paragraphs.',
  'Keep paragraphs short and separate them with one blank line.',
  'Do not use Markdown, HTML, headings, lists, tables, block quotes, backticks, or code fences.',
  'If code or a formula is essential, write it as unformatted plain text.',
  'Match the user\'s language unless they request another language.',
].join(' ')

// Leave time to report an error before Vercel's 300-second function limit.
const REQUEST_TIMEOUT_MS = 270_000
const MAX_CONTEXT_CHARACTERS = 40_000

export interface ChatService {
  streamChat: (
    messages: ChatTurn[],
    signal: AbortSignal,
  ) => Promise<ReadableStream<Uint8Array>>
}

export class ChatUnavailableError extends Error {
  constructor() {
    super('AI Chat is missing required server environment variables')
    this.name = 'ChatUnavailableError'
  }
}

export function createChatService(): ChatService {
  return {
    // The request schema validates the shape and per-message limits; the
    // trimming below only keeps the prompt within a predictable budget.
    async streamChat(messages, signal) {
      const apiKey = optionalEnv('AI_API_KEY')
      const baseURL = optionalEnv('AI_BASE_URL')?.replace(/\/+$/, '')
      const model = optionalEnv('AI_MODEL')

      if (!apiKey || !baseURL || !model) throw new ChatUnavailableError()

      // Keep recent complete exchanges within a predictable prompt size.
      const context = messages.slice(-MAX_CHAT_CONTEXT_MESSAGES)
      while (
        context.length > 1
        && context.reduce((length, message) => length + message.content.length, 0) > MAX_CONTEXT_CHARACTERS
      ) {
        // Shorten a dialogue pair until the context is no longer too large.
        context.splice(0, 2)
      }

      const providerController = new AbortController()

      try {
        const client = new OpenAI({
          apiKey,
          baseURL,
          maxRetries: 0,
          timeout: REQUEST_TIMEOUT_MS,
        })
        const stream = await client.chat.completions.create(
          {
            // The browser supplies conversational turns, never the system prompt
            // or model. The fixed server instruction comes before the context.
            messages: [
              { content: SYSTEM_PROMPT, role: 'system' },
              ...context,
            ],
            model,
            stream: true,
          },
          {
            // Cover the entire stream, including pauses while the model thinks.
            signal: AbortSignal.any([
              providerController.signal,
              signal,
              AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            ]),
          },
        )
        return toChatStream(stream, () => providerController.abort())
      }
      catch (error) {
        providerController.abort()
        throw error
      }
    },
  }
}
