import { ComponentPropsWithoutRef, PropsWithChildren } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const button = tv({
  base: 'inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors cursor-pointer border border-transparent',
  variants: {
    variant: {
      outline: 'border border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/50',
      solid: 'bg-blue-500/50 hover:border hover:border-blue-500',
    },
  },
  defaultVariants: {
    variant: 'outline',
  },
})

export interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>, VariantProps<typeof button> {}

export default function Button({
  children,
  className,
  variant,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button className={button({ variant, className })} {...props}>
      {children}
    </button>
  )
}
