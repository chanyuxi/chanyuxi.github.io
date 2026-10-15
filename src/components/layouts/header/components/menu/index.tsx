import MenuIcon from '~icons/lucide/menu'
import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

interface MenuProps {
  items: { name: string, path: string }[]
}

const MobileMenu = lazy(() => import('./mobile-menu'))

export default function Menu({ items }: MenuProps) {
  const [mobileMenuRequested, setMobileMenuRequested] = useState(false)

  return (
    <nav className="relative">
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-6 lg:flex">
          {items.map(item => (
            <Button
              className="capitalize"
              key={item.path}
              render={<Link to={item.path} />}
              variant="nav"
            >
              {item.name}
            </Button>
          ))}
        </div>

        {mobileMenuRequested
          ? (
              <Suspense
                fallback={(
                  <Button
                    aria-busy="true"
                    aria-haspopup="dialog"
                    aria-label="Loading navigation"
                    className="lg:hidden"
                    disabled
                    size="icon"
                    variant="outline"
                  >
                    <MenuIcon aria-hidden="true" className="size-4.5" />
                  </Button>
                )}
              >
                <MobileMenu items={items} />
              </Suspense>
            )
          : (
              <Button
                aria-haspopup="dialog"
                aria-label="Toggle navigation"
                className="lg:hidden"
                onClick={() => setMobileMenuRequested(true)}
                size="icon"
                variant="outline"
              >
                <MenuIcon aria-hidden="true" className="size-4.5" />
              </Button>
            )}
      </div>
    </nav>
  )
}
