import { authClient } from '@/libs/auth'

import { CredentialsForm } from '../components/credentials-form'
import { SessionPanel } from '../components/session-panel'

export default function SignIn() {
  const { data: session, isPending } = authClient.useSession()

  return (
    <section className="flex min-h-[calc(100svh-4.5rem)] items-center py-14 sm:py-20">
      <div className="base-container">
        <div className="mx-auto w-full max-w-sm">
          <p className="text-center text-xs font-medium tracking-eyebrow text-muted-soft uppercase dark:text-stone-500">
            Authentication
          </p>
          <h1 className="mt-4 text-center font-serif text-4xl font-light tracking-display sm:text-5xl">
            Sign in
          </h1>
          <p className="mt-5 text-center text-base leading-7 text-muted-foreground dark:text-stone-300">
            Sign in with your email and password to manage the site.
          </p>

          <div className="mt-10">
            {isPending
              ? null
              : session
                ? <SessionPanel email={session.user.email} name={session.user.name} />
                : <CredentialsForm />}
          </div>
        </div>
      </div>
    </section>
  )
}
