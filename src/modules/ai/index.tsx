import { ArrowUp } from 'lucide-react'
import { type SubmitEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

type ChatMessage = {
  content: string
  id: string
  role: 'assistant' | 'user'
  status: 'complete' | 'failed' | 'pending'
}

type ChatStreamEvent
  = | { content: string, type: 'delta' }
    | { type: 'done' | 'error' }

const MAX_MESSAGE_LENGTH = 4000

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const requestRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Native content sizing handles modern browsers; measure only as a fallback.
  useLayoutEffect(() => {
    const textarea = inputRef.current
    if (!textarea || CSS.supports('field-sizing', 'content')) return
    const resize = () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [input])

  useEffect(() => () => requestRef.current?.abort(), [])

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    // The ref also blocks two submits before React renders the loading state.
    if (loading || requestRef.current) {
      return
    }

    const message = input.trim()
    if (!message || input.length > MAX_MESSAGE_LENGTH) {
      setError(`Enter a message of up to ${MAX_MESSAGE_LENGTH} characters.`)
      return
    }

    const controller = new AbortController()
    const userId = crypto.randomUUID()
    const replyId = crypto.randomUUID()
    let reply = ''
    requestRef.current = controller
    setLoading(true)
    setError(null)
    setMessages(current => [...current, {
      content: message,
      id: userId,
      role: 'user',
      status: 'pending',
    }, {
      content: '',
      id: replyId,
      role: 'assistant',
      status: 'pending',
    }])

    try {
      // Send up to ten completed exchanges plus the current question. Failed
      // or unfinished replies stay visible but are excluded from AI context.
      const context = messages
        .filter(message => message.status === 'complete')
        .slice(-20)
        .map(({ content, role }) => ({ content, role }))
      const response = await fetch('/api/chat', {
        body: JSON.stringify({ messages: [...context, { content: message, role: 'user' }] }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error('AI request failed')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let completed = false

      // A network chunk can contain several events or part of a JSON line.
      // Keep unfinished lines until the next chunk, including split UTF-8 text.
      const readLine = (line: string) => {
        if (!line.trim()) return
        const event = JSON.parse(line) as ChatStreamEvent
        if (event.type === 'error') throw new Error('AI stream failed')
        if (event.type === 'done') {
          completed = true
          return
        }
        if (event.type !== 'delta' || typeof event.content !== 'string') {
          throw new Error('Invalid AI stream event')
        }
        reply += event.content
        setMessages(current => current.map(message =>
          message.id === replyId ? { ...message, content: reply } : message,
        ))
      }

      try {
        while (!completed) {
          const { done, value } = await reader.read()
          buffer += done ? decoder.decode() : decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            readLine(line)
            if (completed) break
          }
          if (done) {
            if (buffer.trim()) readLine(buffer)
            break
          }
        }
      }
      finally {
        await reader.cancel().catch(() => {})
        reader.releaseLock()
      }

      if (!completed || !reply.trim()) throw new Error('AI reply was interrupted')
      setMessages(current => current.map(message =>
        message.id === userId || message.id === replyId
          ? { ...message, status: 'complete' }
          : message,
      ))
      setInput('')
    }
    catch {
      if (!controller.signal.aborted) {
        setMessages(current => current.map(message =>
          message.id === userId || message.id === replyId
            ? { ...message, status: 'failed' }
            : message,
        ))
        if (!reply.trim()) {
          setMessages(current => current.filter(message => message.id !== replyId))
        }
        setError(reply.trim()
          ? 'The reply was interrupted. Your input is still here; please try again.'
          : 'Could not get a reply. Your input is still here; please try again.')
      }
      controller.abort()
    }
    finally {
      requestRef.current = null
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <div className="base-container">
        <div className="mb-8 space-y-4">
          <h1 className="font-serif text-4xl font-light tracking-section sm:text-5xl">
            AI Chat
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            Ask something, then follow your curiosity. Each reply builds on your conversation.
          </p>
        </div>

        <div>
          <div
            aria-busy={loading}
            aria-label="Conversation"
            aria-relevant="additions text"
            className="min-h-64 space-y-4 px-2 py-5 sm:py-6"
            role="log"
          >
            {messages.length === 0 && !error && (
              <div className="flex min-h-52 items-center justify-center text-center">
                <p className="text-sm leading-6 text-muted-foreground">
                  Your conversation will appear here.
                </p>
              </div>
            )}

            {messages.map(message => (
              <div
                className={`flex animate-in duration-300 fade-in slide-in-from-bottom-2 motion-reduce:animate-none ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                key={message.id}
              >
                <div
                  className={
                    message.role === 'user'
                      ? 'relative max-w-[85%] rounded-2xl rounded-br-lg bg-green-600 p-4 text-white shadow-soft sm:max-w-[75%]'
                      : 'relative max-w-[85%] rounded-2xl rounded-bl-lg bg-primary p-4 text-primary-foreground shadow-soft sm:max-w-[75%]'
                  }
                >
                  <svg
                    aria-hidden="true"
                    className={message.role === 'user'
                      ? 'pointer-events-none absolute -right-1.5 bottom-0 h-4 w-5 fill-green-600'
                      : 'pointer-events-none absolute bottom-0 -left-1.5 h-4 w-5 -scale-x-100 fill-primary'}
                    preserveAspectRatio="none"
                    viewBox="0 0 32 24"
                  >
                    <path d="M0 0H16C16 12 21 20 32 24C16 24 4 18 0 8Z" />
                  </svg>
                  <span className="sr-only">{message.role === 'user' ? 'You' : 'AI'}</span>
                  {message.content
                    ? (
                        <p className="text-base leading-6 wrap-anywhere whitespace-pre-wrap">
                          {message.content}
                          {loading && message.id === messages.at(-1)?.id && (
                            <span aria-hidden="true" className="ml-1 inline-block h-4 w-0.5 bg-current align-middle motion-safe:animate-pulse" />
                          )}
                        </p>
                      )
                    : (
                        <div aria-label="Waiting for a reply" className="flex h-6 items-center gap-1.5" role="status">
                          <span className="size-1.5 rounded-full bg-current motion-safe:animate-pulse" />
                          <span className="size-1.5 rounded-full bg-current [animation-delay:150ms] motion-safe:animate-pulse" />
                          <span className="size-1.5 rounded-full bg-current [animation-delay:300ms] motion-safe:animate-pulse" />
                        </div>
                      )}
                </div>
              </div>
            ))}

            {error && (
              <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm leading-6 text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <textarea
            aria-describedby="ai-input-hint"
            aria-label="Your message"
            className="block field-sizing-content min-h-12 w-full resize-none overflow-hidden rounded-2xl border-0 bg-card px-5 py-4 text-base leading-7 shadow-soft transition-shadow duration-300 placeholder:text-muted-foreground read-only:opacity-60 focus-visible:shadow-ink/10 focus-visible:outline-none dark:focus-visible:shadow-black/40"
            id="ai-message"
            maxLength={MAX_MESSAGE_LENGTH}
            onChange={event => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter'
                && !event.shiftKey
                && !event.nativeEvent.isComposing
                && event.nativeEvent.keyCode !== 229
              ) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
            placeholder="Ask something…"
            readOnly={loading}
            ref={inputRef}
            rows={1}
            value={input}
          />
          <div className="flex flex-wrap items-center justify-end gap-4 pt-1">
            <p className="mr-auto text-xs leading-5 text-muted-foreground" id="ai-input-hint">
              Enter to send · Shift + Enter for a new line
            </p>
            <Button
              className="min-w-36 gap-3 px-8 text-base shadow-soft"
              disabled={!input.trim()}
              loading={loading}
              size="lg"
              type="submit"
            >
              {!loading && <ArrowUp aria-hidden="true" className="size-4" />}
              Send
            </Button>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Your conversation stays on this page and resets when you leave or refresh.
          </p>
        </form>
      </div>
    </section>
  )
}
