import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'

import Home from '@/views/home'

import { RootLayout } from './components/root-layout'

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
        path: 'poetry',
        lazy: async () => {
          const { default: Component } = await import('@/views/poetry')

          return { Component }
        },
        children: [
          {
            path: 'entrance',
            lazy: async () => {
              const { default: Component } =
                await import('@/views/poetry/entrance')

              return { Component }
            },
          },
          {
            path: ':category/:slug',
            lazy: async () => {
              const { default: Component } =
                await import('@/views/poetry/detail')

              return { Component }
            },
          },
          {
            path: ':category',
            lazy: async () => {
              const { default: Component } =
                await import('@/views/poetry/category')

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
