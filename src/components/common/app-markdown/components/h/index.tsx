import { PropsWithChildren } from 'react'

import { cn } from '@/libs/utils'

interface HProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
}

const headingSizes: Record<HProps['level'], string> = {
  1: 'text-3xl',
  2: 'text-2xl',
  3: 'text-2xl',
  4: 'text-xl',
  5: 'text-xl',
  6: 'text-lg',
}

export default function H({ children, level }: PropsWithChildren<HProps>) {
  const Tag = `h${level}` as const

  return <Tag className={cn('my-4', headingSizes[level])}>{children}</Tag>
}
