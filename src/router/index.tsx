import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'

import Home from '@/views/Home'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default function RouterRender() {
  return <RouterProvider router={router} />
}
