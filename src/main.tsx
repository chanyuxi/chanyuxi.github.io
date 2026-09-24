import './index.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'

import App from './App'
import { queryClient } from './libs/query-client'

const root = createRoot(document.querySelector('#root')!)

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
