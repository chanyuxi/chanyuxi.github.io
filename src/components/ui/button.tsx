import { Button as ButtonPrimitive } from '@base-ui/react/button'
import LoaderCircle from '~icons/lucide/loader-circle'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/libs/utils'

const buttonVariants = cva(
  'group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        'default': 'h-10 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        'icon': 'size-10',
        'icon-lg': 'size-11',
        'icon-sm': 'size-8',
        'icon-xs': 'size-7 [&_svg:not([class*="size-"])]:size-3',
        'lg': 'h-11 gap-2 px-6',
        'menu': 'h-11 w-full justify-start gap-2.5 rounded-xl px-4',
        'menu-sm': 'h-9 w-full justify-start gap-2.5 rounded-md px-2.5',
        'sm': 'h-8 gap-1.5 px-3 text-xs [&_svg:not([class*="size-"])]:size-3.5',
        'xs': 'h-7 gap-1 px-2.5 text-xs [&_svg:not([class*="size-"])]:size-3',
      },
      variant: {
        'default': 'bg-primary text-primary-foreground hover:bg-primary/85',
        'destructive': 'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        'ghost': 'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        'link': 'h-auto p-0 text-ink underline-offset-4 hover:underline dark:text-stone-100',
        'menu-item': 'text-muted-foreground hover:bg-muted hover:text-ink aria-expanded:bg-muted aria-expanded:text-foreground dark:text-stone-300 dark:hover:bg-muted/50 dark:hover:text-white',
        'muted': 'text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-white/10',
        'nav': 'h-auto px-0 text-muted-foreground hover:text-ink dark:hover:text-stone-50',
        'outline': 'border-input bg-transparent text-ink hover:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground dark:text-stone-100',
        'quiet': 'h-auto p-0 font-normal text-muted-foreground hover:text-ink dark:hover:text-stone-100',
        'secondary': 'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
      },
    },
  },
)

function Button({
  children,
  className,
  disabled,
  loading = false,
  nativeButton,
  size = 'default',
  variant = 'default',
  ...props
}: { loading?: boolean } & ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ className, size, variant }))}
      data-slot="button"
      disabled={disabled || loading}
      nativeButton={nativeButton ?? !props.render}
      {...props}
    >
      {loading && <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
