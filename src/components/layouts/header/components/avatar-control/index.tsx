import type { ComponentProps, ReactNode } from 'react'

import { LogOut, Settings, UserRound } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/contexts/auth'
import { toast } from '@/libs/toast'
import { cn } from '@/libs/utils'

interface MenuRowProps extends ComponentProps<typeof Button> {
  destructive?: boolean
  icon: ReactNode
}

export default function AvatarControl() {
  const { isSigningOut, signOut, status, user } = useAuth()

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
    <Popover>
      <PopoverTrigger
        aria-label="Open account menu"
        className="rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      >
        <Avatar size="lg">
          <AvatarFallback className="bg-secondary/70 text-sm font-medium text-secondary-foreground backdrop-blur-md dark:bg-secondary/50">
            {(user.name.trim() || user.email).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="gap-0 bg-card/70 p-0 backdrop-blur-xl"
        sideOffset={5}
      >
        <PopoverTitle className="sr-only">Account</PopoverTitle>

        <div className="px-3.5 pt-3 pb-2.5">
          <p className="truncate text-sm font-medium text-card-foreground">
            {user.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {user.email}
          </p>
        </div>

        <div className="hairline-divider" />

        <div className="flex flex-col gap-0.5 p-1.5">
          <MenuRow
            disabled
            icon={(
              <UserRound
                aria-hidden="true"
                size={16}
              />
            )}
          >
            Profile
          </MenuRow>
          <MenuRow
            disabled
            icon={(
              <Settings
                aria-hidden="true"
                size={16}
              />
            )}
          >
            Settings
          </MenuRow>
        </div>

        <div className="hairline-divider" />

        <div className="p-1.5">
          <MenuRow
            destructive
            disabled={isSigningOut}
            icon={(
              <LogOut
                aria-hidden="true"
                size={16}
              />
            )}
            loading={isSigningOut}
            onClick={handleSignOut}
          >
            Sign out
          </MenuRow>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function MenuRow({
  children,
  className,
  destructive = false,
  icon,
  ...props
}: MenuRowProps) {
  return (
    <Button
      className={cn(
        'h-9 w-full justify-start gap-2.5 rounded-md px-2.5 text-muted-foreground disabled:text-muted-soft motion-reduce:transition-none dark:disabled:text-stone-500 [&_svg]:pointer-events-none',
        destructive
        && 'hover:bg-destructive/10 hover:text-destructive',
        className,
      )}
      type="button"
      variant="ghost"
      {...props}
    >
      {icon}
      {children}
    </Button>
  )
}
