import { type PropsWithChildren } from 'react'

export default function Layout(props: PropsWithChildren) {
  const { children } = props

  return (
    <main className="font-bitter relative flex min-h-screen flex-col bg-sky-50 text-black duration-300 dark:bg-zinc-900 dark:text-white">
      {children}
    </main>
  )
}
