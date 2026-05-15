import { ThemeProvider } from '@/contexts/theme'
import RouterRender from '@/router'

export default function App() {
  return (
    <ThemeProvider>
      <RouterRender />
    </ThemeProvider>
  )
}
