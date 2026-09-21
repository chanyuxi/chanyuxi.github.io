import { ComponentPropsWithoutRef, PropsWithChildren } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const button = tv({
  base: 'inline-flex cursor-pointer items-center gap-2 rounded-full border border-transparent px-4 py-2 transition-colors',
  defaultVariants: {
    variant: 'outline',
  },
  variants: {
    variant: {
      outline: 'border border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/50',
      solid: 'bg-blue-500/50 hover:border hover:border-blue-500',
    },
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
    <button className={button({ className, variant })} type="button" {...props}>
      {children}
    </button>
  )
}
