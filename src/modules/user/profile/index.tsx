import { useMeQuery } from '@/services/auth/queries'

import { ActivitySection } from './components/activity-section'
import { ErrorState } from './components/error-state'
import { LoadingState } from './components/loading-state'
import { UserInfoCard } from './components/user-info-card'

export default function UserProfile() {
  const { data: user, isError, isFetching, isPending, refetch } = useMeQuery()

  if (isPending) {
    return <LoadingState />
  }

  if (isError || !user) {
    return (
      <ErrorState
        isFetching={isFetching}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <section className="pt-8 pb-14 sm:pt-12 sm:pb-18 lg:pb-24">
      <div className="base-container">
        <UserInfoCard user={user} />
        <ActivitySection />
      </div>
    </section>
  )
}
