import { useNavigate } from 'react-router'

import Menu from './components/menu'

export default function Header() {
  const navigate = useNavigate()

  const items = [
    { name: 'skill', path: '/skills' },
    { name: 'product', path: '/product' },
    { name: 'Post', path: '/post/entrance' },
    { name: 'experience', path: '/experience' },
    { name: 'cooperation', path: '/cooperation' },
  ]

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-blue-200/50 backdrop-blur-xs dark:bg-black/50">
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
