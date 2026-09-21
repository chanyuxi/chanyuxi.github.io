import { type PropsWithChildren } from 'react'

export default function Layout(props: PropsWithChildren) {
  const { children } = props

  return (
    <main className="relative flex min-h-screen flex-col font-bitter duration-300">
      {children}
    </main>
  )
}
