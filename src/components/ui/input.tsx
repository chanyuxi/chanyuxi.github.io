import { Input as InputPrimitive } from '@base-ui/react/input'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/libs/utils'

const inputVariants = cva(
  'w-full min-w-0 text-foreground outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'h-11 rounded-sm border border-input bg-card px-3.5 py-2 text-base shadow-soft transition-all duration-300 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-soft focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:bg-muted aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:placeholder:text-stone-500 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        title: 'border-0 bg-transparent p-0 font-serif text-2xl leading-tight font-light tracking-display text-ink placeholder:text-muted-soft sm:text-3xl dark:text-stone-50',
      },
    },
  },
)

function Input({
  className,
  type,
  variant,
  ...props
}: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      className={cn(inputVariants({ className, variant }))}
      data-slot="input"
      type={type}
      {...props}
    />
  )
}

export { Input }
