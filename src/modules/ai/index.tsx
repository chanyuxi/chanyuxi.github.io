import { ChatInput } from './components/chat-input'
import { ChatMessageList } from './components/chat-message-list'
import { useAIChat } from './hooks/use-ai-chat'

export default function AIChat() {
  const { error, handleSubmit, input, inputRef, loading, messages, setInput } = useAIChat()

  return (
    <section className="section-spacing">
      <div className="base-container">
        <div className="mb-8 space-y-4">
          <h1 className="display-heading">
            Talking
          </h1>
          <p className="section-body">
            Ask something, then follow your curiosity. Each reply builds on your conversation.
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
