import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '@/contexts/auth'
import { type AuthLocationState } from '@/libs/return-location'
import { useMeQuery } from '@/services/auth/queries'

import { AuthRouteLoading } from './auth-route'

const PROFILE_SETUP_PATH = '/profile-setup'

/**
 * Global enforcement for the one-time Profile Setup flow. Authenticated
 * users without `isProfileInitialized` are steered into /profile-setup
 * from every page (including public ones). While the session is still
 * being checked (deferred by design), pages render optimistically so
 * anonymous visitors — the overwhelming majority — keep an instant first
 * paint; only the authenticated profile lookup may briefly block. A
 * failing `/api/me` fails open so a broken profile service never locks
 * people out of the site.
 */
export function ProfileGate() {
  const { status } = useAuth()
  const location = useLocation()
  const me = useMeQuery({ enabled: status === 'authenticated' })

  if (status === 'authenticated') {
    if (me.isPending) {
      return <AuthRouteLoading />
    }

    const profile = me.data?.profile

    if (profile && !profile.isProfileInitialized) {
      // Carry the pre-login destination along so setup can return there.
      const from = (location.state as AuthLocationState | null)?.from

      return (
        <Navigate
          replace
          state={from ? { from } : undefined}
          to={PROFILE_SETUP_PATH}
        />
      )
    }
  }

  return <Outlet />
}
