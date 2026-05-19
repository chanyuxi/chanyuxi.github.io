import type { PropsWithChildren } from 'react'

export interface PoetryProps {
  title: string
}

export default function Poetry({
  title,
  children,
}: PropsWithChildren<PoetryProps>) {
  return (
    <div className="flex flex-col items-center select-none">
      <div className="mb-8 text-4xl">{title}</div>
      <div className="flex flex-col gap-1 text-2xl">{children}</div>
    </div>
  )
}
