import OpenAI from 'openai'

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

type ChatTurn = { content: string, role: 'assistant' | 'user' }

export class ChatUnavailableError extends Error {
  constructor() {
    super('AI Chat is missing required server environment variables')
    this.name = 'ChatUnavailableError'
  }
}

export async function streamChat(messages: ChatTurn[], signal: AbortSignal) {
  const apiKey = process.env.AI_API_KEY?.trim()
  const baseURL = process.env.AI_BASE_URL?.trim().replace(/\/+$/, '')
  const model = process.env.AI_MODEL?.trim()

  if (!apiKey || !baseURL || !model) throw new ChatUnavailableError()

  // Keep recent complete exchanges within a predictable prompt size.
  const context = messages.slice(-21)
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
}

/** The SDK parses SSE; the browser receives only text, completion, or failure. */
function toChatStream(
  upstream: AsyncIterable<OpenAI.ChatCompletionChunk>,
  abortProvider: () => void,
) {
  const encoder = new TextEncoder()
  let cancelled = false

  return new ReadableStream<Uint8Array>({
    cancel() {
      cancelled = true
      abortProvider()
    },
    async start(controller) {
      let completed = false
      let hasText = false
      const send = (event: object) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
      }
      // Blank lines keep an idle connection active while a model is thinking.
      const heartbeat = setInterval(() => {
        if (!cancelled) controller.enqueue(encoder.encode('\n'))
      }, 15_000)

      try {
        for await (const chunk of upstream) {
          if (cancelled) break
          const choice = chunk.choices?.[0]
          const delta = choice?.delta?.content
          if (delta) {
            hasText ||= Boolean(delta.trim())
            send({ content: delta, type: 'delta' })
          }
          // Token-limited or filtered replies remain retryable, not complete.
          if (choice?.finish_reason === 'stop') completed = true
        }

        if (!cancelled) {
          if (!completed || !hasText) throw new Error('AI stream ended without a complete answer')
          send({ type: 'done' })
        }
      }
      catch (error) {
        if (!cancelled) {
          console.error('AI stream failed', error)
          send({ type: 'error' })
        }
      }
      finally {
        clearInterval(heartbeat)
        abortProvider()
        if (!cancelled) controller.close()
      }
    },
  })
}
