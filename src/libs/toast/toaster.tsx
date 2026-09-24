import { XIcon } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'
import { useSyncExternalStore } from 'react'

import { toastStore } from './store'

const toastVariants: Variants = {
  animate: {
    filter: 'blur(0px)',
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
    y: 0,
  },
  exit: {
    filter: 'blur(3px)',
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
    y: 8,
  },
  initial: {
    filter: 'blur(4px)',
    opacity: 0,
    scale: 0.98,
    y: 12,
  },
}

const reducedMotionVariants: Variants = {
  animate: {
    opacity: 1,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1, ease: 'easeOut' },
  },
  initial: { opacity: 0 },
}

export function Toaster() {
  const snapshot = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot,
  )
  const shouldReduceMotion = useReducedMotion()
  const current = snapshot.current

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-4 sm:top-24 sm:bottom-auto">
      <AnimatePresence initial={false} mode="wait">
        {current && (
          <motion.div
            animate="animate"
            className="pointer-events-auto flex h-12 w-160 max-w-full items-center gap-3 rounded-full border border-border bg-card pr-1 pl-5 text-sm text-card-foreground shadow-soft"
            exit="exit"
            initial="initial"
            key={current.id}
            variants={shouldReduceMotion ? reducedMotionVariants : toastVariants}
          >
            <span
              aria-atomic="true"
              aria-live="polite"
              className="min-w-0 flex-1 truncate"
              role="status"
            >
              {current.message}
            </span>
            <button
              aria-label="Dismiss notification"
              className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              onClick={() => toastStore.dismiss(current.id)}
              type="button"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
