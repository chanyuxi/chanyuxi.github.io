import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/theme'
import { cn } from '@/libs/utils'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className={cn('rounded-full', className)}
      onClick={toggleTheme}
      size="icon"
      variant="outline"
    >
      {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
    </Button>
  )
}
