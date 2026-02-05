import { useTheme } from '@/contexts/theme'
import { Menu as MenuIcon, Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

interface MenuProps {
  items: { name: string; path: string }[]
}

export default function Menu(props: MenuProps) {
  const { items } = props

  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickInsideMenu = target.closest('[data-menu]')
      const isClickOnMenuButton = target.closest('[data-menu-button]')

      if (!isClickInsideMenu && !isClickOnMenuButton) {
        setIsOpen(false)
      }
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [])

  return (
    <nav className="relative">
      <div className="flex gap-4">
        <div className="hidden gap-4 lg:flex">
          {items.map(item => (
            <div
              className="cursor-pointer capitalize underline-offset-6 hover:underline"
              key={item.path}
            >
              {item.name}
            </div>
          ))}
        </div>

        <div onClick={toggleTheme}>
          {theme === 'light' ? <Moon /> : <Sun />}
        </div>
        <div className="lg:hidden" onClick={toggleMenu} data-menu-button>
          <MenuIcon />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-menu
            className="absolute right-0 origin-top-right lg:hidden"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <ul className="mt-2 w-40 divide-y divide-slate-100/20 rounded-lg border border-slate-100/20 bg-white/80 shadow dark:bg-black/80 dark:shadow-none">
              {items.map(item => (
                <li key={item.path} className="p-4 capitalize">
                  {item.name}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
