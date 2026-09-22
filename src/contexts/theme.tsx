import {
  createContext,
  type PropsWithChildren,
  use,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider(props: PropsWithChildren) {
  const { children } = props

  const [theme, setTheme] = useState(getInitialTheme)

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme => currentTheme === 'light' ? 'dark' : 'light')
  }, [])

  const contextValue = useMemo<ThemeContextType>(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  )

  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    root.style.colorScheme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  return <ThemeContext value={contextValue}>{children}</ThemeContext>
}

export function useTheme() {
  const context = use(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

function getInitialTheme(): Theme {
  const root = document.documentElement
  if (root.classList.contains('dark')) {
    return 'dark'
  }
  if (root.classList.contains('light')) {
    return 'light'
  }

  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') {
    return saved
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}
