import type { ToastOptions } from './store'

import { toastStore } from './store'

export { Toaster } from './toaster'
export type { ToastOptions }

export function toast(message: string, options?: ToastOptions) {
  toastStore.add(message, options)
}
