import type { SiteLikes } from '@shared/contracts/site-likes'

import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'

import { siteLikesQueryKeys } from '@/services/site-likes/key'
import {
  useIncrementSiteLikesMutation,
} from '@/services/site-likes/mutations'

const SUBMISSION_DELAY_MS = 450

interface LikeBatch {
  increment: number
  timer: ReturnType<typeof setTimeout> | undefined
}

export function useBatchedLikeSubmission() {
  const queryClient = useQueryClient()

  const { isPending, mutateAsync } = useIncrementSiteLikesMutation()
  const [hasPendingLikes, setHasPendingLikes] = useState(false)

  const pendingIncrementRef = useRef(0)
  const shouldRevalidateRef = useRef(false)

  const pendingBatchRef = useRef<LikeBatch | null>(null)
  const submissionQueueRef = useRef<Promise<void>>(Promise.resolve())

  const commitPendingIncrement = useCallback((pendingIncrement: number) => {
    pendingIncrementRef.current = pendingIncrement
    setHasPendingLikes(pendingIncrement > 0)

    if (pendingIncrement === 0 && shouldRevalidateRef.current) {
      shouldRevalidateRef.current = false
      queryClient.invalidateQueries({
        queryKey: siteLikesQueryKeys.count(),
      })
    }
  }, [queryClient])

  const flushBatch = useCallback((batch: LikeBatch) => {
    // Cancel the scheduled flush when unmounting sends the batch
    // immediately.
    if (batch.timer) {
      clearTimeout(batch.timer)
    }

    // Close this batch so new likes start a separate one.
    if (pendingBatchRef.current === batch) {
      pendingBatchRef.current = null
    }

    const queuedSubmission = submissionQueueRef.current.then(
      () => mutateAsync(batch.increment),
    )

    // Keep the queue fulfilled so one failed request does not block
    // later batches.
    submissionQueueRef.current = queuedSubmission.then(
      (siteLikes) => {
        // The batch was successful; scaling back the optimistic update
        // value.
        const remainingIncrement = Math.max(
          0,
          pendingIncrementRef.current - batch.increment,
        )

        queryClient.setQueryData<SiteLikes>(siteLikesQueryKeys.count(), {
          count: siteLikes.count + remainingIncrement,
        })
        commitPendingIncrement(remainingIncrement)
      },
      () => {
        const currentCount = queryClient.getQueryData<SiteLikes>(
          siteLikesQueryKeys.count(),
        )?.count ?? 0
        const remainingIncrement = Math.max(
          0,
          pendingIncrementRef.current - batch.increment,
        )

        shouldRevalidateRef.current = true
        queryClient.setQueryData<SiteLikes>(siteLikesQueryKeys.count(), {
          count: Math.max(0, currentCount - batch.increment),
        })
        commitPendingIncrement(remainingIncrement)
      },
    )
  }, [commitPendingIncrement, mutateAsync, queryClient])

  const enqueueLike = useCallback(() => {
    pendingIncrementRef.current += 1
    setHasPendingLikes(true)

    // Cancel pending requests so they do not interfere with our
    // subsequent optimistic updates.
    // Canceling the request on initial load means the user might
    // start with zero likes, but that doesn't matter; once the
    // mutation succeeds, we can fetch the latest data.
    queryClient.cancelQueries({
      queryKey: siteLikesQueryKeys.count(),
    })

    // Optimistic update
    queryClient.setQueryData<SiteLikes>(
      siteLikesQueryKeys.count(),
      current => ({
        count: (current?.count ?? 0) + 1,
      }),
    )

    let batch = pendingBatchRef.current

    if (!batch) {
      batch = { increment: 0, timer: undefined }
      pendingBatchRef.current = batch
    }

    batch.increment += 1

    if (batch.timer) {
      clearTimeout(batch.timer)
    }

    // Simulate throttling by scheduling an update after
    // SUBMISSION_DELAY_MS milliseconds.
    batch.timer = setTimeout(() => flushBatch(batch), SUBMISSION_DELAY_MS)
  }, [flushBatch, queryClient])

  useEffect(() => () => {
    // Flush a pending batch before the hook is removed.
    const batch = pendingBatchRef.current

    if (batch) {
      flushBatch(batch)
    }
  }, [flushBatch])

  return { enqueueLike, isPending: hasPendingLikes || isPending }
}
