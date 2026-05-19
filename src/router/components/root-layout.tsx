import { Outlet } from 'react-router'

import Footer from '@/components/footer'
import Header from '@/components/header'
import Layout from '@/components/layout'

import { ScrollToTop } from './scroll-to-top'

export function RootLayout() {
  return (
    <Layout>
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </Layout>
  )
}
