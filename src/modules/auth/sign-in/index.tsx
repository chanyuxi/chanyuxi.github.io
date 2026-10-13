import { Card, CardContent } from '@/components/ui/card'

import { CredentialsForm } from '../components/credentials-form'

export default function SignIn() {
  return (
    <section className="flex min-h-[calc(100svh-4.5rem)] items-center bg-[radial-gradient(circle_at_50%_30%,rgb(167_229_211/28%),transparent_28rem)] py-10 sm:py-16 dark:bg-[radial-gradient(circle_at_50%_30%,rgb(200_184_224/14%),transparent_28rem)]">
      <div className="base-container">
        <Card className="mx-auto w-full max-w-md gap-0 rounded-2xl py-0" variant="glass">
          <CardContent className="p-6 sm:p-8">
            <h1 className="text-center font-serif text-4xl font-light tracking-display">
              Sign in
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-muted-foreground dark:text-stone-300">
              Use your email and password to continue.
            </p>

            <div className="mt-8">
              <CredentialsForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
