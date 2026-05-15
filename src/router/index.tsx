import { useEffect } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from 'react-router'

import Footer from '@/components/footer'
import Header from '@/components/header'
import Layout from '@/components/layout'
import Home from '@/views/home'

function ScrollToTop() {
  const { hash, pathname, search } = useLocation()

  useEffect(() => {
    if (hash) {
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [hash, pathname, search])

  return null
}

function RootLayout() {
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

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'skills',
        lazy: async () => {
          const { default: Component } = await import('@/views/skill')

          return { Component }
        },
      },
      {
        path: 'post',
        children: [
          {
            path: 'entrance',
            lazy: async () => {
              const { default: Component } =
                await import('@/views/post/entrance')

              return { Component }
            },
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])

export default function RouterRender() {
  return <RouterProvider router={router} />
}
