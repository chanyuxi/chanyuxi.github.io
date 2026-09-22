import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/theme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="rounded-full"
      onClick={toggleTheme}
      size="icon"
      variant="outline"
    >
      {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
    </Button>
  )
}
