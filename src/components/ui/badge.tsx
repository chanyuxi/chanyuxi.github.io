import type { ComponentProps } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        destructive: 'border-transparent bg-destructive text-white',
        outline: 'text-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        skill: 'border-transparent bg-skill-badge text-skill-badge-foreground',
      },
    },
  },
)

function Badge({
  className,
  variant,
  ...props
}: ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      className={cn(badgeVariants({ className, variant }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
