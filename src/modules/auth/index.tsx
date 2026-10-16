import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import RainBackground from '@/components/common/rain-background'

import { CredentialsForm } from './components/credentials-form'
import { type AuthMode } from './schema'

const titles: Record<AuthMode, string> = {
  'sign-in': 'Sign in',
  'sign-up': 'Create account',
}

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative isolate flex min-h-page items-center overflow-hidden section-spacing">
      <RainBackground density={1.06} scale={0.92} speed={1.1} />

      <div className="relative z-10 base-container">
        <div className="mx-auto w-full max-w-md">
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
              <h1 className="display-heading">
                {titles[mode]}
              </h1>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8">
            <CredentialsForm mode={mode} onModeChange={setMode} />
          </div>
        </div>
      </div>
    </section>
  )
}
