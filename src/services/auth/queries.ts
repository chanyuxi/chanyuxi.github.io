import { useQuery } from '@tanstack/react-query'

import { authQueryKeys } from './key'
import { requestMe } from './request'

// `enabled` lets the global profile gate subscribe only for authenticated
// visitors, so anonymous traffic never triggers a doomed 401 request.
export function useMeQuery(options?: { enabled?: boolean }) {
  const { enabled = true } = options ?? {}

  return useQuery({
    enabled,
    // Guards render cached data instantly while navigating between pages;
    // sign-out removes the entry so nothing survives across sessions.
    queryFn: ({ signal }) => requestMe(signal),
    queryKey: authQueryKeys.me(),
    staleTime: 30_000,
  })
}
