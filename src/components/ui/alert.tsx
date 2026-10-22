import type { ComponentProps } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/libs/utils'

const alertVariants = cva(
  'grid w-full gap-2 rounded-lg border px-4 py-3 text-sm leading-6',
  {
    defaultVariants: {
      variant: 'destructive',
    },
    variants: {
      variant: {
        destructive: 'border-destructive/30 bg-destructive/5 text-destructive',
      },
    },
  },
)

function Alert({
  className,
  variant,
  ...props
}: ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      className={cn(alertVariants({ className, variant }))}
      role="alert"
      {...props}
    />
  )
}

export { Alert, alertVariants }
