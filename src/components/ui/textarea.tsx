import * as React from 'react'

import { cn } from '@/libs/utils'

// Mirrors the Input component's surface styling for multi-line fields.
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full resize-y rounded-sm border border-input bg-card px-3.5 py-2.5 text-base text-foreground shadow-soft transition-all duration-300 outline-none placeholder:text-muted-soft focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:placeholder:text-stone-500 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      data-slot="textarea"
      {...props}
    />
  )
}

export { Textarea }
