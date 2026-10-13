import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { authClient, resetAccessToken } from '@/libs/auth'
import { useMeQuery } from '@/services/auth/queries'

type SessionPanelProps = {
  email: string
  name: string
}

export function SessionPanel({ email, name }: SessionPanelProps) {
  const [loading, setLoading] = useState(false)
  const { data: me, error, isPending } = useMeQuery()

  const initial = (name.trim() || email).charAt(0).toUpperCase()

  async function handleSignOut() {
    setLoading(true)
    resetAccessToken()
    await authClient.signOut()
    setLoading(false)
  }

  return (
    <div className="rounded-xl border border-hairline bg-card p-6 shadow-soft dark:border-white/10">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-medium text-secondary-foreground"
        >
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-card-foreground">{name}</p>
          <p className="truncate text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      {isPending
        ? null
        : error
          ? (
              <p className="mt-5 text-sm leading-6 text-destructive" role="alert">
                The API session could not be verified. Reload the page to retry.
              </p>
            )
          : (
              <p className="mt-5 text-sm leading-6 text-muted-foreground dark:text-stone-300">
                API session verified for
                {' '}
                {me?.email}
                .
              </p>
            )}
      <Button
        className="mt-6 w-full"
        loading={loading}
        onClick={handleSignOut}
        variant="outline"
      >
        Sign out
      </Button>
    </div>
  )
}
