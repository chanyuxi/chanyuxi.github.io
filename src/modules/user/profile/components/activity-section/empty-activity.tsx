import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

import { type ActivityTab, activityTabs } from './activity-tabs'

export function EmptyActivity({ tabId }: { tabId: ActivityTab }) {
  const activity = activityTabs.find(tab => tab.id === tabId)!
  const Icon = activity.icon

  return (
    <div
      aria-live="polite"
      className="mt-6 flex min-h-64 flex-col items-center justify-center text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h2 className="mt-5 text-lg font-medium text-ink dark:text-stone-100">
        {`No ${activity.label.toLowerCase()} yet`}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {activity.description}
      </p>
      {activity.id === 'posts'
        ? (
            <Button
              className="mt-5"
              render={<Link to="/post/editor" />}
              size="sm"
              variant="outline"
            >
              Write your first post
            </Button>
          )
        : null}
    </div>
  )
}
