import type { ComponentProps, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utils'

export default function MenuItem({
  children,
  className,
  destructive = false,
  icon,
  size = 'menu-sm',
  ...props
}: {
  destructive?: boolean
  icon?: ReactNode
} & ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        'disabled:text-muted-soft motion-reduce:transition-none dark:disabled:text-stone-500',
        destructive && 'hover:bg-destructive/10 hover:text-destructive',
        className,
      )}
      size={size}
      type={props.render ? undefined : 'button'}
      variant="menu-item"
      {...props}
    >
      {icon}
      {children}
    </Button>
  )
}
