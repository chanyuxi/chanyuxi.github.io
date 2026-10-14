import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'

import { CredentialsForm } from './components/credentials-form'
import { type AuthMode } from './schema'

const titles: Record<AuthMode, string> = {
  'sign-in': 'Sign in',
  'sign-up': 'Create account',
}

const descriptions: Record<AuthMode, string> = {
  'sign-in': 'Use your email and password to continue.',
  'sign-up': 'Use your name, email, and password to continue.',
}

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="flex min-h-page items-center section-spacing">
      <div className="base-container">
        <Card className="mx-auto w-full max-w-md gap-0 rounded-2xl py-0" variant="glass">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
                key={mode}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.25,
                  ease: 'easeOut',
                }}
              >
                <h1 className="display-heading text-center">
                  {titles[mode]}
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-muted-foreground dark:text-stone-300">
                  {descriptions[mode]}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8">
              <CredentialsForm mode={mode} onModeChange={setMode} />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
