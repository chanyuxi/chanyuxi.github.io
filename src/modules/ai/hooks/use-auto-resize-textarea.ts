import type { RefObject } from 'react'

import { useLayoutEffect } from 'react'

// Native content sizing handles modern browsers; measure only as a fallback.
export function useAutoResizeTextarea(ref: RefObject<HTMLTextAreaElement | null>, value: string) {
  useLayoutEffect(() => {
    const textarea = ref.current
    if (!textarea || CSS.supports('field-sizing', 'content')) return
    const resize = () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [ref, value])
}
