import { StatusPage } from '../components/status-page'

export default function NotFound() {
  return (
    <StatusPage
      description="The page you're looking for doesn't exist."
      label="404"
      title="Page not found"
    />
  )
}
