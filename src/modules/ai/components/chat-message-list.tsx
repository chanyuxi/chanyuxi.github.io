import type { ChatMessage } from '../type'

import MessageCircleMore from '~icons/lucide/message-circle-more'
import { memo } from 'react'

import { Alert } from '@/components/ui/alert'

import { ChatBubble } from './chat-bubble'

type ChatMessageListProps = {
  error: null | string
  loading: boolean
  messages: ChatMessage[]
}

// Memoized so keystrokes in the chat input (parent state) do not re-render
// the conversation; the messages identity only changes on stream flushes.
export const ChatMessageList = memo(function ChatMessageList(
  { error, loading, messages }: ChatMessageListProps,
) {
  const lastMessageId = messages.at(-1)?.id

  return (
    <div
      aria-busy={loading}
      aria-label="Conversation"
      aria-relevant="additions text"
      className="min-h-64 space-y-4 px-2 py-5 sm:py-6"
      role="log"
    >
      {messages.length === 0 && !error && (
        <div className="flex min-h-52 items-center justify-center">
          <MessageCircleMore
            aria-hidden="true"
            className="size-20 text-muted-soft dark:text-stone-600"
          />
        </div>
      )}

      {messages.map(message => (
        <ChatBubble
          key={message.id}
          message={message}
          streaming={loading && message.id === lastMessageId}
        />
      ))}

      {error && (
        <Alert>{error}</Alert>
      )}
    </div>
  )
})
