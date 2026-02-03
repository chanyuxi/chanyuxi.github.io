import Menu from './components/Menu'
export default function Header() {
  const items = [
    { name: 'Home', path: '/home' },
    { name: 'Skills', path: '/skills' },
    { name: 'Products', path: '/products' },
    { name: 'Posts', path: '/posts' },
    { name: 'Experience', path: '/experience' },
    { name: 'Cooperation', path: '/cooperation' },
  ]

  return (
    <header className="sticky top-0 z-10 flex w-full items-center bg-white/50 p-6 backdrop-blur-xs dark:bg-black/50">
      <span>CHANYUXI</span>

      <div className="ml-auto">
        <Menu items={items} />
      </div>
    </header>
  )
}
