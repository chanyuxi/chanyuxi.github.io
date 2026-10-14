import type { ChatMessage, ChatStreamEvent } from '../type'

import {
  MAX_CHAT_CONTEXT_MESSAGES,
  MAX_CHAT_MESSAGE_LENGTH,
} from '@shared/constants/chat'
import { type SubmitEvent, useEffect, useRef, useState } from 'react'

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
        .slice(-(MAX_CHAT_CONTEXT_MESSAGES - 1))
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
