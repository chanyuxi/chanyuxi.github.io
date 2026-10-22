import type { ComponentType } from 'react'
import type { RouteObject } from 'react-router'

import { Navigate } from 'react-router'

import Home from '@/modules/home'

import { PublicOnlyRoute, RequireAuth } from './components/auth-route'
import { ProfileGate } from './components/profile-gate'
import { RootLayout } from './components/root-layout'
import { routeMetadata } from './metadata'

type RouteModule = {
  default: ComponentType
}

const lazyRoute = (load: () => Promise<RouteModule>) => async () => {
  const { default: Component } = await load()

  return { Component }
}

export const routes = [
  {
    children: [
      {
        // Profile setup lives outside ProfileGate so the gate can never
        // redirect-loop with the page that completes the flow.
        children: [
          {
            handle: routeMetadata.profileSetup,
            lazy: lazyRoute(() => import('@/modules/user/profile-setup')),
            path: 'profile-setup',
          },
        ],
        Component: RequireAuth,
      },
      {
        children: [
          {
            Component: Home,
            index: true,
          },
          {
            handle: routeMetadata.introduction,
            lazy: lazyRoute(() => import('@/modules/introduction')),
            path: 'introduction',
          },
          {
            handle: routeMetadata.changelog,
            lazy: lazyRoute(() => import('@/modules/changelog')),
            path: 'changelog',
          },
          {
            handle: routeMetadata.ai,
            lazy: lazyRoute(() => import('@/modules/ai')),
            path: 'ai',
          },
          {
            children: [
              {
                handle: routeMetadata.auth,
                lazy: lazyRoute(() => import('@/modules/auth')),
                path: 'auth',
              },
            ],
            Component: PublicOnlyRoute,
          },
          {
            children: [
              {
                handle: routeMetadata.profile,
                lazy: lazyRoute(() => import('@/modules/user/profile')),
                path: 'user/profile',
              },
            ],
            Component: RequireAuth,
          },
          {
            element: <Navigate replace to="/under-development" />,
            path: 'product',
          },
          {
            children: [
              {
                handle: routeMetadata.posts,
                index: true,
                lazy: lazyRoute(() => import('@/modules/post/entrance')),
              },
              {
                children: [
                  {
                    handle: routeMetadata.myPosts,
                    lazy: lazyRoute(() => import('@/modules/post/mine')),
                    path: 'mine',
                  },
                  {
                    handle: routeMetadata.postEditor,
                    lazy: lazyRoute(() => import('@/modules/post/editor')),
                    path: 'editor/:id?',
                  },
                ],
                Component: RequireAuth,
              },
              {
                handle: routeMetadata.posts,
                lazy: lazyRoute(() => import('@/modules/post/detail')),
                path: ':slug',
              },
            ],
            handle: routeMetadata.posts,
            lazy: lazyRoute(() => import('@/modules/post')),
            path: 'post',
          },
          {
            element: <Navigate replace to="/post" />,
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
            handle: routeMetadata.underDevelopment,
            lazy: lazyRoute(() => import('@/modules/platform/under-development')),
            path: 'under-development',
          },
          {
            handle: routeMetadata.notFound,
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
                lazy: async () => {
                  const { default: Component, loader } = await import('../modules/poetries/detail')

                  return { Component, loader }
                },
                path: ':catalog/:slug',
              },
              {
                lazy: lazyRoute(() => import('../modules/poetries/catalog')),
                path: ':catalog',
              },
            ],
            handle: routeMetadata.poetries,
            lazy: lazyRoute(() => import('../modules/poetries')),
            path: 'poetries',
          },
          {
            element: <Navigate replace to="/404" />,
            path: '*',
          },
        ],
        Component: ProfileGate,
      },
    ],
    Component: RootLayout,
    handle: routeMetadata.home,
    path: '/',
  },
] satisfies RouteObject[]
