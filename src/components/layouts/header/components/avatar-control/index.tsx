import LogOut from '~icons/lucide/log-out'
import Settings from '~icons/lucide/settings'
import UserRound from '~icons/lucide/user-round'
import { useState } from 'react'
import { Link } from 'react-router'

import MenuItem from '@/components/common/menu-item'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/contexts/auth'
import { toast } from '@/libs/toast'

export default function AvatarControl() {
  const { isSigningOut, signOut, status, user } = useAuth()
  const [open, setOpen] = useState(false)

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
          <AvatarFallback className="bg-secondary/70 font-medium text-secondary-foreground backdrop-blur-md dark:bg-secondary/50">
            {(user.name.trim() || user.email).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={5}
        variant="glass"
      >
        <PopoverTitle className="sr-only">Account</PopoverTitle>

        <div className="flex flex-col gap-0.5 p-1.5">
          <MenuItem
            icon={<UserRound aria-hidden="true" />}
            onClick={() => setOpen(false)}
            render={<Link to="/user/profile" />}
          >
            Profile
          </MenuItem>
          <MenuItem
            disabled
            icon={<Settings aria-hidden="true" />}
          >
            Settings
          </MenuItem>
          <MenuItem
            destructive
            disabled={isSigningOut}
            icon={<LogOut aria-hidden="true" />}
            loading={isSigningOut}
            onClick={handleSignOut}
          >
            Sign out
          </MenuItem>
        </div>
      </PopoverContent>
    </Popover>
  )
}
