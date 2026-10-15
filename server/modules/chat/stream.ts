import OpenAI from 'openai'

/** The SDK parses SSE; the browser receives only text, completion, or failure. */
export function toChatStream(
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
