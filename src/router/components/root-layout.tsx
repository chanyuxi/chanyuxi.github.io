import { Outlet } from 'react-router'

import Footer from '@/components/layouts/footer'
import Header from '@/components/layouts/header'
import Layout from '@/components/layouts/layout'

import { RouteMetadata, useIsFooterHidden } from './route-metadata'
import { ScrollToTop } from './scroll-to-top'

export function RootLayout() {
  const isFooterHidden = useIsFooterHidden()

  return (
    <Layout>
      <RouteMetadata />
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      {isFooterHidden ? null : <Footer />}
    </Layout>
  )
}
