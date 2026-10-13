import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import { AuthProvider } from '@/contexts/auth'
import { ThemeProvider } from '@/contexts/theme'
import { Toaster } from '@/libs/toast'
import RouterRender from '@/router'

import { TooltipProvider } from './components/ui/tooltip'

export default function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <RouterRender />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>

      <Analytics />
      <SpeedInsights />
    </>
  )
}
