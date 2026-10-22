import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/libs/utils'

interface PostListSkeletonProps {
  /** Rows to render; defaults to the public list's three placeholders. */
  compact?: boolean
  count?: number
}

export function PostListSkeleton({
  compact = false,
  count = 3,
}: PostListSkeletonProps) {
  return (
    <div className={cn('flex flex-col', compact ? 'gap-3' : 'gap-4 sm:gap-5')}>
      {Array.from({ length: count }, (_, index) => (
        <div
          className={cn(
            'shadow-soft',
            compact
              ? 'rounded-xl border border-white/60 bg-card/70 p-4 backdrop-blur-xl dark:border-white/10'
              : 'rounded-2xl bg-card p-5 sm:p-6 dark:bg-dark-elevated',
          )}
          key={index}
        >
          <Skeleton className={cn('h-3', compact ? 'w-32' : 'w-40')} />
          <Skeleton className={cn('w-2/3', compact ? 'mt-3 h-6' : 'mt-4 h-7')} />
          <Skeleton className={cn('w-full max-w-xl', compact ? 'mt-2 h-3' : 'mt-3 h-4')} />
          {!compact
            ? <Skeleton className="mt-2 h-4 w-4/5 max-w-lg" />
            : null}
        </div>
      ))}
    </div>
  )
}
