import { useMutation } from '@tanstack/react-query'

import { siteLikesMutationKeys } from './key'
import { incrementSiteLikes } from './request'

export function useIncrementSiteLikesMutation() {
  return useMutation({
    mutationFn: incrementSiteLikes,
    mutationKey: siteLikesMutationKeys.increment(),
  })
}
