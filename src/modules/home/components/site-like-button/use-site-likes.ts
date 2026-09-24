import { useCallback } from 'react'

import { useSiteLikesQuery } from '@/services/site-likes/queries'

import { useBatchedLikeSubmission } from './use-batched-like-submission'
import { useLikedToday } from './use-liked-today'

export function useSiteLikes() {
  const { data, isPending: isLoading } = useSiteLikesQuery()
  const { enqueueLike, isPending: isSubmitting } = useBatchedLikeSubmission()
  const { hasLikedToday, markLikedToday } = useLikedToday()

  const like = useCallback(() => {
    // A user can submit additional likes after the first like of the day.
    markLikedToday()
    enqueueLike()
  }, [enqueueLike, markLikedToday])

  return {
    count: data?.count ?? null,
    hasLikedToday,
    isLoading,
    isSubmitting,
    like,
  }
}
