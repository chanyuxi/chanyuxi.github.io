import Menu from './components/Menu'
export default function Header() {
  const items = [
    { name: 'skill', path: '/skill' },
    { name: 'product', path: '/product' },
    { name: 'Post', path: '/post' },
    { name: 'experience', path: '/experience' },
    { name: 'cooperation', path: '/cooperation' },
  ]

  return (
    <header className="sticky top-0 z-10 w-full bg-blue-200/50 backdrop-blur-xs dark:bg-black/50">
      <div className="content-constraint">
        <div className="flex items-center py-6">
          <span className="select-none">CHANYUXI</span>

          <div className="ml-auto">
            <Menu items={items} />
          </div>
        </div>
      </div>
    </header>
  )
}
