import type { ChatMessage, ChatStreamEvent } from '../type'

import {
  MAX_CHAT_CONTEXT_MESSAGES,
  MAX_CHAT_MESSAGE_LENGTH,
} from '@shared/constants/chat'
import { apiErrorResponseSchema } from '@shared/contracts/api'
import { type SubmitEvent, useEffect, useRef, useState } from 'react'

// Stream deltas are batched into ~16 state updates per second so the token
// rate never dictates the render rate. The completion and error updates
// below always commit the final content, so no tail is lost to the throttle.
const STREAM_FLUSH_INTERVAL_MS = 60

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const requestRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => () => requestRef.current?.abort(), [])

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    // The ref also blocks two submits before React renders the loading state.
    if (loading || requestRef.current) {
      return
    }

    const message = input.trim()
    if (!message || input.length > MAX_CHAT_MESSAGE_LENGTH) {
      setError(`Enter a message of up to ${MAX_CHAT_MESSAGE_LENGTH} characters.`)
      return
    }

    const controller = new AbortController()
    const userId = crypto.randomUUID()
    const replyId = crypto.randomUUID()
    let reply = ''
    let failureMessage: null | string = null
    let flushTimer: ReturnType<typeof setTimeout> | undefined
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

    // Deltas accumulate in `reply`; flushes apply the latest text at a
    // fixed interval instead of once per token.
    const cancelFlush = () => {
      if (flushTimer !== undefined) {
        clearTimeout(flushTimer)
        flushTimer = undefined
      }
    }

    const flushReply = () => {
      flushTimer = undefined
      setMessages(current => current.map(message =>
        message.id === replyId ? { ...message, content: reply } : message,
      ))
    }

    try {
      // Send up to ten completed exchanges plus the current question. Failed
      // or unfinished replies stay visible but are excluded from AI context.
      const context = messages
        .filter(message => message.status === 'complete')
        .slice(-(MAX_CHAT_CONTEXT_MESSAGES - 1))
        .map(({ content, role }) => ({ content, role }))
      const response = await fetch('/api/chat', {
        body: JSON.stringify({ messages: [...context, { content: message, role: 'user' }] }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        failureMessage = await readChatErrorMessage(response)
        throw new Error(failureMessage)
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
        if (flushTimer === undefined) {
          flushTimer = setTimeout(flushReply, STREAM_FLUSH_INTERVAL_MS)
        }
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

      // Commit any tail the throttle has not flushed yet, then finalize.
      cancelFlush()

      if (!completed || !reply.trim()) throw new Error('AI reply was interrupted')
      setMessages(current => current.map(message =>
        message.id === replyId
          ? { ...message, content: reply, status: 'complete' }
          : message.id === userId
            ? { ...message, status: 'complete' }
            : message,
      ))
      setInput('')
    }
    catch {
      cancelFlush()

      if (!controller.signal.aborted) {
        setMessages(current => current.map(message =>
          message.id === replyId
            ? { ...message, content: reply, status: 'failed' }
            : message.id === userId
              ? { ...message, status: 'failed' }
              : message,
        ))
        if (!reply.trim()) {
          setMessages(current => current.filter(message => message.id !== replyId))
        }
        setError(failureMessage ?? (reply.trim()
          ? 'The reply was interrupted. Your input is still here; please try again.'
          : 'Could not get a reply. Your input is still here; please try again.'))
      }
      controller.abort()
    }
    finally {
      requestRef.current = null
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return {
    error,
    handleSubmit,
    input,
    inputRef,
    loading,
    messages,
    setInput,
  }
}

// Prefer the structured error body when the server rejects the request.
async function readChatErrorMessage(response: Response) {
  try {
    const result = apiErrorResponseSchema.safeParse(await response.json())

    if (result.success) {
      return result.data.error.message
    }
  }
  catch {
    // The error body is not JSON; fall back to the generic message.
  }

  return 'AI request failed'
}
