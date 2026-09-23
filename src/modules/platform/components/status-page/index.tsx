import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

import { buttonVariants } from '@/components/ui/button'

interface StatusPageProps {
  description: string
  label: string
  title: string
}

export function StatusPage(props: StatusPageProps) {
  const { description, label, title } = props

  return (
    <section className="flex min-h-[calc(100svh-4.5rem)] items-center py-14 sm:py-20">
      <div className="base-container">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-medium tracking-eyebrow text-muted-soft uppercase dark:text-stone-500">
            {label}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-display sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground dark:text-stone-300">
            {description}
          </p>
          <div className="mt-8 flex justify-center">
            <Link className={buttonVariants({ size: 'lg' })} to="/">
              <ArrowLeft data-icon="inline-start" />
              Back home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
