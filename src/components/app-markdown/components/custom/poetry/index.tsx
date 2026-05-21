import type { PropsWithChildren } from 'react'
import { cn } from 'tailwind-variants'

export interface PoetryProps {
  title: string
  type: 'poetry' | 'lyric'
}

export default function Poetry({
  type = 'poetry',
  title,
  children,
}: PropsWithChildren<PoetryProps>) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center select-none">
      <div className="mb-8 text-2xl sm:mb-10 sm:text-3xl">{title}</div>
      <div
        className={cn(
          'flex flex-col gap-2 text-left text-xl sm:gap-4 sm:text-2xl',
          type === 'poetry'
            ? 'text-center'
            : 'text-left [&>p]:indent-10 sm:[&>p]:indent-12'
        )}
      >
        {children}
      </div>
    </div>
  )
}
