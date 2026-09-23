import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'

import Menu from './components/menu'

export default function Header() {
  const navigate = useNavigate()

  const items = [
    { name: 'Introduction', path: '/introduction' },
    { name: 'product', path: '/product' },
    { name: 'Post', path: '/post/entrance' },
    { name: 'life', path: '/life' },
    { name: 'cooperation', path: '/cooperation' },
  ]

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-10 w-full border-b border-hairline bg-canvas/85 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-dark-surface/85">
      <div className="base-container">
        <div className="flex min-h-18 items-center">
          <Button
            className="h-auto px-0 text-sm font-semibold tracking-navigation text-ink hover:bg-transparent dark:text-stone-50"
            onClick={handleLogoClick}
            variant="ghost"
          >
            CHANYUXI
          </Button>

          <div className="ml-auto">
            <Menu items={items} />
          </div>
        </div>
      </div>
    </header>
  )
}
