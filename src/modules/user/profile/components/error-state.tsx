import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ErrorStateProps {
  isFetching: boolean
  onRetry: () => void
}

export function ErrorState({ isFetching, onRetry }: ErrorStateProps) {
  return (
    <section className="flex min-h-page items-center section-spacing">
      <div className="base-container">
        <Card className="mx-auto max-w-lg text-center" variant="glass">
          <CardContent className="px-6 py-8 sm:px-8">
            <p className="section-eyebrow">Profile unavailable</p>
            <h1 className="section-heading">We could not load your profile</h1>
            <p className="section-body mt-4">
              Check your connection and try again.
            </p>
            <Button
              className="mt-6"
              loading={isFetching}
              onClick={onRetry}
              variant="outline"
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
