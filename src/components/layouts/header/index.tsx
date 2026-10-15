import { useNavigate } from 'react-router'

import ThemeToggle from '@/components/common/theme-toggle'
import { Button } from '@/components/ui/button'

import AvatarControl from './components/avatar-control'
import Menu from './components/menu'

export default function Header() {
  const navigate = useNavigate()

  const items = [
    { name: 'Introduction', path: '/introduction' },
    { name: 'product', path: '/product' },
    { name: 'Post', path: '/post/entrance' },
    { name: 'AI', path: '/ai' },
    { name: 'life', path: '/life' },
    { name: 'cooperation', path: '/cooperation' },
  ]

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-10 w-full border-b border-hairline bg-canvas/85 backdrop-blur-xl transition-colors duration-300 dark:bg-dark-surface/85">
      <div className="base-container">
        <div className="flex min-h-18 items-center">
          <Button
            className="font-semibold tracking-navigation text-ink dark:text-stone-50"
            onClick={handleLogoClick}
            variant="nav"
          >
            CHANYUXI
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Menu items={items} />
            <ThemeToggle />
            <AvatarControl />
          </div>
        </div>
      </div>
    </header>
  )
}
