import type { PropsWithChildren } from 'react'

export interface PoetryProps {
  title: string
}

export default function Poetry({
  title,
  children,
}: PropsWithChildren<PoetryProps>) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">{title}</div>
      <div>{children}</div>
    </div>
  )
}
