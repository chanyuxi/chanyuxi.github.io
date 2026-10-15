import type { RefObject, SubmitEvent } from 'react'

import { MAX_CHAT_MESSAGE_LENGTH } from '@shared/constants/chat'
import ArrowUp from '~icons/lucide/arrow-up'

import { Button } from '@/components/ui/button'

import { useAutoResizeTextarea } from '../hooks/use-auto-resize-textarea'

type ChatInputProps = {
  input: string
  inputRef: RefObject<HTMLTextAreaElement | null>
  loading: boolean
  onChange: (value: string) => void
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void
}

export function ChatInput({ input, inputRef, loading, onChange, onSubmit }: ChatInputProps) {
  useAutoResizeTextarea(inputRef, input)

  return (
    <form className="mt-6 space-y-3" onSubmit={onSubmit}>
      <div className="relative">
        <textarea
          aria-describedby="ai-input-hint"
          aria-label="Your message"
          className="block field-sizing-content min-h-12 w-full resize-none overflow-hidden rounded-2xl border-0 bg-card py-4 pr-16 pl-5 text-base leading-7 shadow-soft transition-shadow duration-300 placeholder:text-muted-foreground read-only:opacity-60 focus-visible:shadow-ink/10 focus-visible:outline-none dark:focus-visible:shadow-black/40"
          id="ai-message"
          maxLength={MAX_CHAT_MESSAGE_LENGTH}
          onChange={event => onChange(event.target.value)}
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
        <Button
          aria-label="Send message"
          className="absolute right-2.5 bottom-2.5"
          disabled={!input.trim()}
          loading={loading}
          size="icon"
          type="submit"
        >
          {!loading && <ArrowUp aria-hidden="true" className="size-5" />}
        </Button>
      </div>
    </form>
  )
}
