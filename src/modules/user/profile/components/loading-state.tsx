import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function LoadingState() {
  return (
    <section
      aria-live="polite"
      className="pt-8 pb-14 sm:pt-12 sm:pb-18 lg:pb-24"
      role="status"
    >
      <div className="base-container">
        <Card variant="glass">
          <CardContent className="flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-center sm:p-8">
            <Skeleton className="size-24 self-center rounded-full sm:size-28" />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="mx-auto h-7 w-44 max-w-full sm:mx-0" />
              <Skeleton className="mx-auto h-4 w-60 max-w-full sm:mx-0" />
              <div className="mt-5 space-y-3">
                <Skeleton className="h-4 max-w-2xl" />
                <Skeleton className="h-4 max-w-sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        <section aria-hidden="true" className="mt-10 sm:mt-12">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </section>
      </div>
      <span className="sr-only">Loading profile…</span>
    </section>
  )
}
