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
    children: [
      {
        Component: Home,
        index: true,
      },
      {
        lazy: lazyRoute(() => import('@/modules/introduction')),
        path: 'introduction',
      },
      {
        children: [
          {
            lazy: lazyRoute(() => import('../modules/poetries/entrance')),
            path: 'entrance',
          },
          {
            lazy: lazyRoute(() => import('../modules/poetries/detail')),
            path: ':catalog/:slug',
          },
          {
            lazy: lazyRoute(() => import('../modules/poetries/catalog')),
            path: ':catalog',
          },
        ],
        lazy: lazyRoute(() => import('../modules/poetries')),
        path: 'poetries',
      },
      {
        element: <Navigate replace to="/" />,
        path: '*',
      },
    ],
    Component: RootLayout,
    path: '/',
  },
])

export default function RouterRender() {
  return <RouterProvider router={router} />
}
