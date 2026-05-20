import { type PropsWithChildren } from 'react'

export default function Layout(props: PropsWithChildren) {
  const { children } = props

  return (
    <main className="font-bitter relative flex min-h-screen flex-col duration-300">
      {children}
    </main>
  )
}
