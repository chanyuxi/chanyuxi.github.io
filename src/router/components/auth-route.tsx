import LoaderCircle from '~icons/lucide/loader-circle'
import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '@/contexts/auth'
import { getReturnTo } from '@/libs/return-location'

export function AuthRouteLoading() {
  return (
    <section
      aria-live="polite"
      className="flex min-h-page items-center justify-center"
      role="status"
    >
      <LoaderCircle aria-hidden="true" className="size-5 text-muted-foreground motion-safe:animate-spin" />
      <span className="sr-only">Checking your session…</span>
    </section>
  )
}

export function PublicOnlyRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <AuthRouteLoading />
  }

  if (status === 'authenticated') {
    return <Navigate replace to={getReturnTo(location.state)} />
  }

  return <Outlet />
}

export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <AuthRouteLoading />
  }

  if (status === 'anonymous') {
    return (
      <Navigate
        replace
        state={{
          from: {
            hash: location.hash,
            pathname: location.pathname,
            search: location.search,
          },
        }}
        to="/auth"
      />
    )
  }

  return <Outlet />
}
