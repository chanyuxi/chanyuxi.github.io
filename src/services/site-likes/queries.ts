import { useQuery } from '@tanstack/react-query'

import { siteLikesQueryKeys } from './key'
import { requestSiteLikes } from './request'

export function useSiteLikesQuery() {
  return useQuery({
    queryFn: ({ signal }) => requestSiteLikes(signal),
    queryKey: siteLikesQueryKeys.count(),
  })
}
