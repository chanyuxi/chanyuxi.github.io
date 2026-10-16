import * as React from 'react'

import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea'
import { cn } from '@/libs/utils'

// Mirrors the Input component's surface styling for multi-line fields.
// Height follows the content: native field-sizing where available, with the
// shared auto-resize hook as the fallback, so no resizer handle is needed.
function Textarea({ className, ref, ...props }: React.ComponentProps<'textarea'>) {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null)

  // Uncontrolled textareas omit `value`; their typing drives the input listener.
  useAutoResizeTextarea(innerRef, typeof props.value === 'string' ? props.value : undefined)

  return (
    <textarea
      className={cn(
        'field-sizing-content min-h-24 w-full resize-none overflow-hidden rounded-sm border border-input bg-card px-3.5 py-2.5 text-base text-foreground shadow-soft transition-all duration-300 outline-none placeholder:text-muted-soft focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:placeholder:text-stone-500 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      data-slot="textarea"
      ref={(node) => {
        innerRef.current = node

        if (typeof ref === 'function') {
          ref(node)
        }
        else if (ref) {
          ref.current = node
        }
      }}
      {...props}
    />
  )
}

export { Textarea }
