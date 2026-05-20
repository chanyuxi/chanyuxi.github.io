import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/contexts/theme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div onClick={toggleTheme}>{theme === 'light' ? <Moon /> : <Sun />}</div>
  )
}
