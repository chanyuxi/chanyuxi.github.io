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
        lazy: lazyRoute(() => import('@/modules/changelog')),
        path: 'changelog',
      },
      {
        element: <Navigate replace to="/under-development" />,
        path: 'product',
      },
      {
        element: <Navigate replace to="/under-development" />,
        path: 'post/entrance',
      },
      {
        element: <Navigate replace to="/under-development" />,
        path: 'life',
      },
      {
        element: <Navigate replace to="/under-development" />,
        path: 'cooperation',
      },
      {
        lazy: lazyRoute(() => import('@/modules/platform/under-development')),
        path: 'under-development',
      },
      {
        lazy: lazyRoute(() => import('@/modules/platform/not-found')),
        path: '404',
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
        element: <Navigate replace to="/404" />,
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
