import Power from '~icons/lucide/power'
import Settings from '~icons/lucide/settings'
import UserRound from '~icons/lucide/user-round'
import { useState } from 'react'
import { Link } from 'react-router'

import MenuItem from '@/components/common/menu-item'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/contexts/auth'
import { toast } from '@/libs/toast'
import { useMeQuery } from '@/services/auth/queries'

export default function AvatarControl() {
  const { isSigningOut, signOut, status, user } = useAuth()
  const [open, setOpen] = useState(false)

  // Identity claims come from the session context, but the avatar URL only
  // exists in the cached me entry the profile gate fetches and setup refreshes.
  const me = useMeQuery({ enabled: status === 'authenticated' })
  const avatarUrl = me.data?.profile.avatarUrl

  const handleSignOut = async () => {
    try {
      await signOut()
    }
    catch {
      toast('Unable to sign out. Please try again.', { immediately: true })
    }
  }

  if (status !== 'authenticated' || !user) {
    return null
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        aria-label="Open account menu"
        className="rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      >
        <Avatar size="lg">
          {avatarUrl && (
            <AvatarImage alt="" src={avatarUrl} />
          )}
          <AvatarFallback className="bg-secondary/70 font-medium text-secondary-foreground backdrop-blur-md dark:bg-secondary/50">
            {(user.name.trim() || user.email).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-auto"
        sideOffset={6}
        variant="glass"
      >
        <div className="flex flex-col gap-1 p-1.5 sm:flex-row">
          <MenuItem
            aria-label="Profile"
            icon={<UserRound aria-hidden="true" />}
            onClick={() => setOpen(false)}
            render={<Link to="/user/profile" />}
            size="icon"
          />
          <MenuItem
            aria-label="Settings"
            disabled
            icon={<Settings aria-hidden="true" />}
            size="icon"
          />
          <MenuItem
            aria-label="Sign out"
            destructive
            disabled={isSigningOut}
            icon={isSigningOut ? undefined : <Power aria-hidden="true" />}
            loading={isSigningOut}
            onClick={handleSignOut}
            size="icon"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
