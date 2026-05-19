import type { ComponentType } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'

import Home from '@/views/home'

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
        path: 'skills',
        lazy: lazyRoute(() => import('@/views/skill')),
      },
      {
        path: 'poetry',
        lazy: lazyRoute(() => import('@/views/poetry')),
        children: [
          {
            path: 'entrance',
            lazy: lazyRoute(() => import('@/views/poetry/entrance')),
          },
          {
            path: ':category/:slug',
            lazy: lazyRoute(() => import('@/views/poetry/detail')),
          },
          {
            path: ':category',
            lazy: lazyRoute(() => import('@/views/poetry/category')),
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
