import type { ChatMessage } from '../type'

import LoaderCircle from '~icons/lucide/loader-circle'
import { memo } from 'react'

type ChatBubbleProps = {
  message: ChatMessage
  streaming: boolean
}

// Memoized so a stream flush only re-renders the bubble whose message
// object changed; completed messages keep a stable reference.
export const ChatBubble = memo(function ChatBubble({ message, streaming }: ChatBubbleProps) {
  return (
    <div
      className={`flex animate-in duration-300 fade-in slide-in-from-bottom-2 motion-reduce:animate-none ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={
          message.role === 'user'
            ? 'relative max-w-[85%] rounded-2xl rounded-br-lg bg-green-600 p-4 text-white shadow-soft sm:max-w-[75%]'
            : 'relative max-w-[85%] rounded-2xl rounded-bl-lg bg-card p-4 text-foreground shadow-soft sm:max-w-[75%]'
        }
      >
        <svg
          aria-hidden="true"
          className={message.role === 'user'
            ? 'pointer-events-none absolute -right-1.5 bottom-0 h-4 w-5 fill-green-600'
            : 'pointer-events-none absolute bottom-0 -left-1.5 h-4 w-5 -scale-x-100 fill-card'}
          preserveAspectRatio="none"
          viewBox="0 0 32 24"
        >
          <path d="M0 0H16C16 12 21 20 32 24C16 24 4 18 0 8Z" />
        </svg>
        {message.content
          ? (
              <p className="text-base leading-6 wrap-anywhere whitespace-pre-wrap">
                {message.content}
                {streaming && (
                  <span aria-hidden="true" className="ml-1 inline-block h-4 w-0.5 bg-current align-middle motion-safe:animate-pulse" />
                )}
              </p>
            )
          : (
              <div aria-label="Waiting for a reply" className="flex h-6 items-center gap-2 text-muted-foreground" role="status">
                <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />
                <span className="text-sm leading-6">Thinking...</span>
              </div>
            )}
      </div>
    </div>
  )
})
