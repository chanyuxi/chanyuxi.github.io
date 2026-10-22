import { useState } from 'react'

import { ActivityTabBar } from './activity-tab-bar'
import { type ActivityTab } from './activity-tabs'
import { EmptyActivity } from './empty-activity'
import { PostsTabContent } from './posts-tab-content'

export function ActivitySection() {
  const [activeTab, setActiveTab] = useState<ActivityTab>('posts')

  return (
    <section aria-label="Activity" className="mt-10 sm:mt-12">
      <ActivityTabBar activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'posts'
        ? <PostsTabContent />
        : <EmptyActivity tabId={activeTab} />}
    </section>
  )
}
