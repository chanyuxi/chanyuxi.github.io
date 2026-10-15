import Moon from '~icons/lucide/moon'
import Sun from '~icons/lucide/sun'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/theme'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className={className}
      onClick={toggleTheme}
      size="icon"
      variant="outline"
    >
      {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </Button>
  )
}
