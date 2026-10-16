import Github from '~icons/simple-icons/github'
import Google from '~icons/simple-icons/google'
import QQ from '~icons/simple-icons/qq'
import Wechat from '~icons/simple-icons/wechat'

import { Button } from '@/components/ui/button'
import { toast } from '@/libs/toast'
import { cn } from '@/libs/utils'

// Grayscale at rest; hovering a provider restores its brand color.
const providers = [
  { hover: 'hover:text-[#4285f4]', icon: Google, label: 'Continue with Google' },
  { hover: 'hover:text-ink dark:hover:text-stone-100', icon: Github, label: 'Continue with GitHub' },
  { hover: 'hover:text-[#12b7f5]', icon: QQ, label: 'Continue with QQ' },
  { hover: 'hover:text-[#07c160]', icon: Wechat, label: 'Continue with WeChat' },
]

// Third-party providers are not wired yet; the avatar-group-style stack only
// reserves a quiet spot under the primary action's lower-left corner.
export function SocialLogins() {
  return (
    <div className="mt-3 flex -space-x-2">
      {providers.map(({ hover, icon: Icon, label }) => (
        <Button
          aria-label={label}
          className={cn('bg-muted ring-2 ring-background', hover)}
          key={label}
          onClick={() => toast('This feature is under development.', { immediately: true })}
          size="icon-sm"
          type="button"
          variant="muted"
        >
          <Icon aria-hidden="true" />
        </Button>
      ))}
    </div>
  )
}
