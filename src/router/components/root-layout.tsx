import { Outlet } from 'react-router'

import Footer from '@/components/layouts/footer'
import Header from '@/components/layouts/header'
import Layout from '@/components/layouts/layout'

import { RouteMetadata } from './route-metadata'
import { ScrollToTop } from './scroll-to-top'

export function RootLayout() {
  return (
    <Layout>
      <RouteMetadata />
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </Layout>
  )
}
