import { RouterProvider } from 'react-router'

import router from './routes'

import '@/styles/global.scss'

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
