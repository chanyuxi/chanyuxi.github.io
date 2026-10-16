import type { RefObject } from 'react'

import { useLayoutEffect } from 'react'

// Native content sizing handles modern browsers; measure only as a fallback.
// Controlled textareas re-run on `value` changes (including programmatic
// ones); uncontrolled ones are covered by the input listener below.
export function useAutoResizeTextarea(
  ref: RefObject<HTMLTextAreaElement | null>,
  value?: string,
) {
  useLayoutEffect(() => {
    const textarea = ref.current

    if (!textarea || CSS.supports('field-sizing', 'content')) {
      return
    }

    const resize = () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }

    resize()
    textarea.addEventListener('input', resize)
    window.addEventListener('resize', resize)

    return () => {
      textarea.removeEventListener('input', resize)
      window.removeEventListener('resize', resize)
    }
  }, [ref, value])
}
