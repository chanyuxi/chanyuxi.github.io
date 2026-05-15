import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router'

import Header from '@/components/header'
import Layout from '@/components/layout'
import Home from '@/views/home'
import PostEntrance from '@/views/post/entrance'
import Skill from '@/views/skill'

function RootLayout() {
  return (
    <Layout>
      <Header />
      <Outlet />
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
        Component: Skill,
      },
      {
        path: 'post',
        children: [
          {
            path: 'entrance',
            Component: PostEntrance,
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
