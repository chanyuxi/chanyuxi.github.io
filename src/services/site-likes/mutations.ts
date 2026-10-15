import { useMutation } from '@tanstack/react-query'

import { siteLikesMutationKeys } from './key'
import { incrementSiteLikes } from './request'

export function useIncrementSiteLikesMutation() {
  // The home page only needs to read and submit a "like" count,
  // yet it ends up preloading the entire `data-vendor` bundle.

  // FIXME: Switch to lightweight `fetch` for likes
  return useMutation({
    mutationFn: incrementSiteLikes,
    mutationKey: siteLikesMutationKeys.increment(),
  })
}
