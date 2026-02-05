import Header from '@/components/Header'
import Layout from '@/components/Layout'
import RouterRender from '@/router'
import { ThemeProvider } from '@/contexts/theme'

export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <RouterRender />
      </Layout>
    </ThemeProvider>
  )
}
