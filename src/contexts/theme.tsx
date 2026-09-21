import {
  createContext,
  type PropsWithChildren,
  use,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

interface ThemeContextType {
  theme: string
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
})

export function ThemeProvider(props: PropsWithChildren) {
  const { children } = props

  const [theme, setTheme] = useState(getInitialTheme)

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const contextValue = useMemo<ThemeContextType>(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  )

  useLayoutEffect(() => {
    const root = document.documentElement
    root.className = theme
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

function getInitialTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') {
    return saved
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}
