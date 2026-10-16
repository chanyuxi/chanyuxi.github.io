import LoaderCircle from '~icons/lucide/loader-circle'
import { Navigate, useLocation } from 'react-router'

import { getReturnTo } from '@/libs/return-location'
import { useMeQuery } from '@/services/auth/queries'

import { SetupForm } from './components/setup-form'

export default function ProfileSetupPage() {
  const location = useLocation()
  const me = useMeQuery()

  if (me.isPending) {
    return (
      <section
        aria-live="polite"
        className="flex min-h-page items-center justify-center"
        role="status"
      >
        <LoaderCircle aria-hidden="true" className="size-5 text-muted-foreground motion-safe:animate-spin" />
        <span className="sr-only">Loading your profile…</span>
      </section>
    )
  }

  // Already-finished users (direct URL access, stale links) are sent back
  // to where they came from, defaulting to their profile page.
  if (me.data?.profile.isProfileInitialized) {
    return <Navigate replace to={resolveReturnTo(location.state)} />
  }

  return (
    <section className="flex min-h-page items-center section-spacing">
      <div className="base-container">
        <div className="mx-auto w-full max-w-md">
          <h1 className="sr-only">Set up your profile</h1>
          <SetupForm returnTo={resolveReturnTo(location.state)} />
        </div>
      </div>
    </section>
  )
}

// Users with no saved pre-login destination land on their profile page.
function resolveReturnTo(state: unknown) {
  const resolved = getReturnTo(state)

  return resolved === '/' ? '/user/profile' : resolved
}
