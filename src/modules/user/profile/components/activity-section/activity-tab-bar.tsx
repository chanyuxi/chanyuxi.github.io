import { Button } from '@/components/ui/button'

import { type ActivityTab, activityTabs } from './activity-tabs'

export function ActivityTabBar({
  activeTab,
  onChange,
}: {
  activeTab: ActivityTab
  onChange: (tab: ActivityTab) => void
}) {
  return (
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
            onClick={() => onChange(tab.id)}
            size="sm"
            variant={selected ? 'secondary' : 'ghost'}
          >
            <Icon aria-hidden="true" />
            {tab.label}
          </Button>
        )
      })}
    </div>
  )
}
