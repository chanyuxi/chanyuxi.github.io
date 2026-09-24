export interface ToastItem {
  id: number
  message: string
}

export interface ToastOptions {
  immediately?: boolean
}

export interface ToastSnapshot {
  current: null | ToastItem
  queue: readonly ToastItem[]
}

const TOAST_DURATION_MS = 4_000

export function createToastStore(duration = TOAST_DURATION_MS) {
  const listeners = new Set<() => void>()
  let nextId = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let snapshot: ToastSnapshot = {
    current: null,
    queue: [],
  }

  const emit = () => {
    listeners.forEach(listener => listener())
  }

  const clearTimer = () => {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  const dismiss = (id?: number) => {
    if (!snapshot.current || (id !== undefined && snapshot.current.id !== id)) {
      return
    }

    clearTimer()

    const [current = null, ...queue] = snapshot.queue
    snapshot = { current, queue }
    emit()

    if (current) {
      timer = setTimeout(() => dismiss(current.id), duration)
    }
  }

  const add = (message: string, options?: ToastOptions) => {
    nextId += 1

    const item: ToastItem = {
      id: nextId,
      message,
    }

    if (options?.immediately || !snapshot.current) {
      clearTimer()
      snapshot = { current: item, queue: snapshot.queue }
      emit()
      timer = setTimeout(() => dismiss(item.id), duration)
      return
    }

    snapshot = {
      current: snapshot.current,
      queue: [...snapshot.queue, item],
    }
    emit()
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  }

  const dispose = () => {
    clearTimer()
    listeners.clear()
  }

  return {
    add,
    dismiss,
    dispose,
    getSnapshot: () => snapshot,
    subscribe,
  }
}

export const toastStore = createToastStore()
