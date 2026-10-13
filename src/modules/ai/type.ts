export type ChatMessage = {
  content: string
  id: string
  role: 'assistant' | 'user'
  status: 'complete' | 'failed' | 'pending'
}

export type ChatStreamEvent
  = | { content: string, type: 'delta' }
    | { type: 'done' | 'error' }
