import { lazy, Suspense } from 'react'
import { Link } from 'react-router'

import ThemeToggle from '@/components/common/theme-toggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth'

import Menu from './components/menu'

const AvatarControl = lazy(() => import('./components/avatar-control'))

export default function Header() {
  const items = [
    { name: 'Introduction', path: '/introduction' },
    { name: 'product', path: '/product' },
    { name: 'Post', path: '/post/entrance' },
    { name: 'AI', path: '/ai' },
    { name: 'life', path: '/life' },
    { name: 'cooperation', path: '/cooperation' },
  ]

  return (
    <header className="sticky top-0 z-10 w-full border-b border-hairline bg-canvas/85 backdrop-blur-xl transition-colors duration-300 dark:bg-dark-surface/85">
      <div className="base-container">
        <div className="flex min-h-18 items-center">
          <Button
            className="font-semibold tracking-navigation text-ink dark:text-stone-50"
            render={<Link to="/" />}
            variant="nav"
          >
            CHANYUXI
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Menu items={items} />
            <ThemeToggle />
            <AuthenticatedAvatarControl />
          </div>
        </div>
      </div>
    </header>
  )
}

function AuthenticatedAvatarControl() {
  const { status } = useAuth()

  if (status !== 'authenticated') return null

  return (
    <Suspense fallback={null}>
      <AvatarControl />
    </Suspense>
  )
}
