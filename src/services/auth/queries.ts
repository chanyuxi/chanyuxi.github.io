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
    // A rejected session is not transient, so retrying only multiplies
    // doomed 401s. The axios interceptor still retries once when a fresh
    // token actually differs (the sign-out-in-another-tab case).
    retry: false,
    staleTime: 30_000,
  })
}
