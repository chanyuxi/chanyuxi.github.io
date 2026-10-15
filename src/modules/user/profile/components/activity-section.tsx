import Bookmark from '~icons/lucide/bookmark'
import FileText from '~icons/lucide/file-text'
import MessageCircle from '~icons/lucide/message-circle'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

const activityTabs = [
  {
    description: 'Published posts will appear here.',
    icon: FileText,
    id: 'posts',
    label: 'Posts',
  },
  {
    description: 'Comments you leave will appear here.',
    icon: MessageCircle,
    id: 'comments',
    label: 'Comments',
  },
  {
    description: 'Saved items will appear here.',
    icon: Bookmark,
    id: 'collections',
    label: 'Collections',
  },
] as const

type ActivityTab = (typeof activityTabs)[number]['id']

export function ActivitySection() {
  const [activeTab, setActiveTab] = useState<ActivityTab>('posts')
  const activeActivity = activityTabs.find(tab => tab.id === activeTab)!
  const ActivityIcon = activeActivity.icon

  return (
    <section aria-label="Activity" className="mt-10 sm:mt-12">
      <div
        aria-label="Profile activity"
        className="flex flex-wrap gap-2"
        role="group"
      >
        {activityTabs.map((tab) => {
          const Icon = tab.icon
          const selected = tab.id === activeTab

          return (
            <Button
              aria-pressed={selected}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              size="sm"
              variant={selected ? 'secondary' : 'ghost'}
            >
              <Icon aria-hidden="true" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      <div
        aria-live="polite"
        className="mt-6 flex min-h-64 flex-col items-center justify-center text-center"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <ActivityIcon aria-hidden="true" className="size-5" />
        </span>
        <h2 className="mt-5 text-lg font-medium text-ink dark:text-stone-100">
          {`No ${activeActivity.label.toLowerCase()} yet`}
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {activeActivity.description}
        </p>
      </div>
    </section>
  )
}
