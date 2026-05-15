import { PropsWithChildren } from 'react'
import { tv } from 'tailwind-variants'

interface HProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
}

const h = tv({
  base: 'my-4',
  variants: {
    level: {
      1: 'text-[32px]',
      2: 'text-[28px]',
      3: 'text-[24px]',
      4: 'text-[22px]',
      5: 'text-[20px]',
      6: 'text-[18px]',
    },
  },
})

export default function H({ level, children }: PropsWithChildren<HProps>) {
  const Tag = `h${level}` as const

  return <Tag className={h({ level })}>{children}</Tag>
}
