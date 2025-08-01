import { createBrowserRouter } from 'react-router'

import Index from '@/layouts/Index'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
])

export default router
