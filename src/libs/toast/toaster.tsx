import { XIcon } from 'lucide-react'
import { useSyncExternalStore } from 'react'

import { toastStore } from './store'

export function Toaster() {
  const snapshot = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot,
  )
  const current = snapshot.current

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-4 sm:top-24 sm:bottom-auto">
      {current && (
        <div
          className="pointer-events-auto flex h-12 w-160 max-w-full items-center gap-3 rounded-full border border-border bg-card pr-1 pl-5 text-sm text-card-foreground shadow-soft motion-safe:animate-[toast-enter_300ms_cubic-bezier(0.22,1,0.36,1)_both]"
          key={current.id}
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
        </div>
      )}
    </div>
  )
}
