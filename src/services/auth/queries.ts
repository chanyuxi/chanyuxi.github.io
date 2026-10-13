import { useQuery } from '@tanstack/react-query'

import { authQueryKeys } from './key'
import { requestMe } from './request'

export function useMeQuery() {
  return useQuery({
    queryFn: ({ signal }) => requestMe(signal),
    queryKey: authQueryKeys.me(),
  })
}
