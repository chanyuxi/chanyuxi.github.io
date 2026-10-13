import { LoaderCircle } from 'lucide-react'
import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '@/contexts/auth'

interface AuthLocationState {
  from?: {
    hash: string
    pathname: string
    search: string
  }
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
        to="/auth/sign-in"
      />
    )
  }

  return <Outlet />
}

function AuthRouteLoading() {
  return (
    <section
      aria-live="polite"
      className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center"
      role="status"
    >
      <LoaderCircle aria-hidden="true" className="size-5 text-muted-foreground motion-safe:animate-spin" />
      <span className="sr-only">Checking your session…</span>
    </section>
  )
}

function getReturnTo(state: unknown) {
  const from = (state as AuthLocationState | null)?.from

  if (
    !from
    || !from.pathname.startsWith('/')
    || from.pathname.startsWith('//')
    || from.pathname === '/auth/sign-in'
  ) {
    return '/'
  }

  return `${from.pathname}${from.search}${from.hash}`
}
