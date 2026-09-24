import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

import { toast } from '@/libs/toast'

const REQUEST_ERROR_FALLBACK = 'Request failed'

function showRequestError(error: unknown) {
  const message = error instanceof Error && error.message.trim()
    ? error.message
    : REQUEST_ERROR_FALLBACK

  toast(message)
}

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
  mutationCache: new MutationCache({
    onError: showRequestError,
  }),
  queryCache: new QueryCache({
    onError: showRequestError,
  }),
})
