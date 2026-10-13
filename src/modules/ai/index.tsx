import { ChatInput } from './components/chat-input'
import { ChatMessageList } from './components/chat-message-list'
import { useAIChat } from './hooks/use-ai-chat'

export default function AIChat() {
  const { error, handleSubmit, input, inputRef, loading, messages, setInput } = useAIChat()

  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <div className="base-container">
        <div className="mb-8 space-y-4">
          <h1 className="font-serif text-4xl font-light tracking-section sm:text-5xl">
            Talking
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            Ask AI(grok-4.7) something, then follow your curiosity. Each reply builds on your conversation.
          </p>
        </div>

        <ChatMessageList error={error} loading={loading} messages={messages} />
        <ChatInput
          input={input}
          inputRef={inputRef}
          loading={loading}
          onChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  )
}
