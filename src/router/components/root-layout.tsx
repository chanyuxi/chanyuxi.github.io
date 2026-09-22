import { Outlet } from 'react-router'

import Footer from '@/components/layouts/footer'
import Header from '@/components/layouts/header'
import Layout from '@/components/layouts/layout'
import { TooltipProvider } from '@/components/ui/tooltip'

import { ScrollToTop } from './scroll-to-top'

export function RootLayout() {
  return (
    <TooltipProvider>
      <Layout>
        <ScrollToTop />
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </Layout>
    </TooltipProvider>
  )
}
