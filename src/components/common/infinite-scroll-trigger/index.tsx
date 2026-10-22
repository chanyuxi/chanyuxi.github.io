import LoaderCircle from '~icons/lucide/loader-circle'
import { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'

interface InfiniteScrollTriggerProps {
  errorMessage?: string
  hasNextPage: boolean
  isError: boolean
  isFetching: boolean
  onLoadMore: () => void
}

export function InfiniteScrollTrigger({
  errorMessage = 'Could not continue loading items.',
  hasNextPage,
  isError,
  isFetching,
  onLoadMore,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const trigger = triggerRef.current

    if (!trigger || !hasNextPage || isFetching || isError) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return

        observer.disconnect()
        onLoadMore()
      },
      { rootMargin: '240px 0px' },
    )

    observer.observe(trigger)

    return () => observer.disconnect()
  }, [hasNextPage, isError, isFetching, onLoadMore])

  if (isError && !isFetching) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 py-8">
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <Button onClick={onLoadMore} size="sm" variant="outline">
          Try again
        </Button>
      </div>
    )
  }

  if (!hasNextPage && !isFetching) return null

  return (
    <div
      className="flex h-16 items-center justify-center"
      ref={triggerRef}
    >
      {isFetching
        ? (
            <div aria-label="Loading more items" role="status">
              <LoaderCircle
                aria-hidden="true"
                className="size-5 text-muted-foreground motion-safe:animate-spin"
              />
            </div>
          )
        : null}
    </div>
  )
}
