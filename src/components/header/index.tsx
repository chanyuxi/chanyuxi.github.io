import { useNavigate } from 'react-router'

import Menu from './components/menu'

export default function Header() {
  const navigate = useNavigate()

  const items = [
    { name: 'Introduction', path: '/introduction' },
    { name: 'product', path: '/product' },
    { name: 'Post', path: '/post/entrance' },
    { name: 'experience', path: '/experience' },
    { name: 'cooperation', path: '/cooperation' },
  ]

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-slate-200/60 backdrop-blur-xs transition-colors duration-300 dark:bg-neutral-900/60">
      <div className="base-container">
        <div className="flex items-center py-6">
          <span className="select-none" onClick={handleLogoClick}>
            CHANYUXI
          </span>

          <div className="ml-auto">
            <Menu items={items} />
          </div>
        </div>
      </div>
    </header>
  )
}
