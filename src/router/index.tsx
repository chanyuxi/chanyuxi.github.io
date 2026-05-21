import type { ComponentType } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'

import Home from '@/modules/home'

import { RootLayout } from './components/root-layout'

type RouteModule = {
  default: ComponentType
}

const lazyRoute = (load: () => Promise<RouteModule>) => async () => {
  const { default: Component } = await load()

  return { Component }
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
        path: 'introduction',
        lazy: lazyRoute(() => import('@/modules/introduction')),
      },
      {
        path: 'poetries',
        lazy: lazyRoute(() => import('../modules/poetries')),
        children: [
          {
            path: 'entrance',
            lazy: lazyRoute(() => import('../modules/poetries/entrance')),
          },
          {
            path: ':catalog/:slug',
            lazy: lazyRoute(() => import('../modules/poetries/detail')),
          },
          {
            path: ':catalog',
            lazy: lazyRoute(() => import('../modules/poetries/catalog')),
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
