import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import { ThemeProvider } from '@/contexts/theme'
import RouterRender from '@/router'

export default function App() {
  return (
    <>
      <ThemeProvider>
        <RouterRender />
      </ThemeProvider>

      <Analytics />
      <SpeedInsights />
    </>
  )
}
