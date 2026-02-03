import {
  createContext,
  type PropsWithChildren,
  use,
  useLayoutEffect,
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

function getInitialTheme() {
  const saved = localStorage.getItem('theme')
  console.log(saved)
  if (saved === 'light' || saved === 'dark') {
    return saved
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeProvider(props: PropsWithChildren) {
  const { children } = props

  const [theme, setTheme] = useState(getInitialTheme)

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  useLayoutEffect(() => {
    const root = document.documentElement
    root.className = theme
  }, [theme])

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>
}

export function useTheme() {
  const context = use(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
