import { Menu as MenuIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import ThemeToggle from '@/components/theme-toggle'

interface MenuProps {
  items: { name: string, path: string }[]
}

export default function Menu(props: MenuProps) {
  const nav = useNavigate()

  const { items } = props

  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuItemClick = (path: string) => {
    nav(path)
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
              onClick={() => handleMenuItemClick(item.path)}
            >
              {item.name}
            </div>
          ))}
        </div>

        <ThemeToggle />
        <div className="lg:hidden" data-menu-button onClick={toggleMenu}>
          <MenuIcon />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-0 origin-top-right lg:hidden"
            data-menu
            exit={{ opacity: 0, scale: 0 }}
            initial={{ opacity: 0, scale: 0 }}
          >
            <ul className="mt-2 w-40 divide-y divide-slate-200 rounded-lg border border-transparent bg-white shadow dark:divide-slate-800 dark:bg-black dark:shadow-none">
              {items.map(item => (
                <li
                  className="p-4 capitalize select-none"
                  key={item.path}
                  onClick={() => handleMenuItemClick(item.path)}
                >
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
