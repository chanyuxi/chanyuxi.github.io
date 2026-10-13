import type { SubmitEvent } from 'react'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { authClient } from '@/libs/auth'
import { cn } from '@/libs/utils'

import { MIN_PASSWORD_LENGTH } from '../constants'

type CredentialsFormMode = 'sign-in' | 'sign-up'

const inputClassName
  = 'h-11 w-full rounded-sm border border-input bg-card px-3.5 text-base text-foreground shadow-soft transition-all duration-300 placeholder:text-muted-soft focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive dark:placeholder:text-stone-500'

const labelClassName
  = 'block text-xs font-medium tracking-label text-muted-foreground uppercase'

export function CredentialsForm() {
  const [error, setError] = useState<null | string>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<CredentialsFormMode>('sign-in')

  const isSignIn = mode === 'sign-in'

  function switchMode() {
    setError(null)
    setMode(isSignIn ? 'sign-up' : 'sign-in')
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email'))
    const name = String(formData.get('name') ?? '')
    const password = String(formData.get('password'))

    setLoading(true)
    setError(null)

    const { error: authError } = isSignIn
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ email, name, password })

    setLoading(false)

    if (authError) {
      setError(authError.message || 'Unable to complete the request. Please try again.')
    }
  }

  return (
    <form
      className="rounded-xl border border-hairline bg-card p-6 shadow-soft dark:border-white/10"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        {isSignIn
          ? null
          : (
              <div>
                <label className={labelClassName} htmlFor="auth-name">
                  Name
                </label>
                <input
                  autoComplete="name"
                  className={cn('mt-2', inputClassName)}
                  disabled={loading}
                  id="auth-name"
                  name="name"
                  placeholder="Your display name"
                  required
                  type="text"
                />
              </div>
            )}

        <div>
          <label className={labelClassName} htmlFor="auth-email">
            Email
          </label>
          <input
            aria-invalid={error ? true : undefined}
            autoComplete="email"
            className={cn('mt-2', inputClassName)}
            disabled={loading}
            id="auth-email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="auth-password">
            Password
          </label>
          <input
            aria-invalid={error ? true : undefined}
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            className={cn('mt-2', inputClassName)}
            disabled={loading}
            id="auth-password"
            minLength={MIN_PASSWORD_LENGTH}
            name="password"
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            required
            type="password"
          />
        </div>
      </div>

      {error
        ? (
            <p className="mt-4 text-sm leading-6 text-destructive" role="alert">
              {error}
            </p>
          )
        : null}

      <Button className="mt-6 w-full" loading={loading} type="submit">
        {isSignIn ? 'Sign in' : 'Create account'}
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground dark:text-stone-300">
        {isSignIn ? 'No account yet? ' : 'Already registered? '}
        <button
          className="font-medium text-foreground underline-offset-4 hover:underline"
          onClick={switchMode}
          type="button"
        >
          {isSignIn ? 'Create one' : 'Sign in instead'}
        </button>
      </p>
    </form>
  )
}
