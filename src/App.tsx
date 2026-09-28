import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import { ThemeProvider } from '@/contexts/theme'
import { Toaster } from '@/libs/toast'
import RouterRender from '@/router'

import { TooltipProvider } from './components/ui/tooltip'

export default function App() {
  return (
    <>
      <ThemeProvider>
        <TooltipProvider>
          <RouterRender />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>

      <Analytics />
      <SpeedInsights />
    </>
  )
}
