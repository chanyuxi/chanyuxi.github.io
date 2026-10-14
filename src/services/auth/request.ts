import { meSchema } from '@shared/contracts/auth'

import { get } from '@/api'

export function requestMe(signal?: AbortSignal) {
  return get('/api/me', { requireAuth: true, responseSchema: meSchema, signal })
}
