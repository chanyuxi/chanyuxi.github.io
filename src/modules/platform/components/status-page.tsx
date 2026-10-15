import ArrowLeft from '~icons/lucide/arrow-left'
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
    <section className="flex min-h-page items-center py-14 sm:py-20">
      <div className="base-container">
        <div className="mx-auto max-w-xl text-center">
          <p className="section-eyebrow">
            {label}
          </p>
          <h1 className="display-heading mt-4">
            {title}
          </h1>
          <p className="section-body mt-5">
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
