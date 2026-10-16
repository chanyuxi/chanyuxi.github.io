import type { Me } from '@shared/contracts/auth'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

interface UserInfoCardProps {
  user: Me
}

export function UserInfoCard({ user }: UserInfoCardProps) {
  const displayName = user.profile.displayName?.trim() || user.name
  const initials = getInitials(displayName, user.email)

  return (
    <Card variant="glass">
      <CardContent className="flex flex-col gap-6 px-6 py-7 text-center sm:flex-row sm:items-center sm:p-8 sm:text-left">
        <Avatar className="size-24 self-center sm:size-28">
          {user.profile.avatarUrl && (
            <AvatarImage
              alt={`${displayName}'s avatar`}
              src={user.profile.avatarUrl}
            />
          )}
          <AvatarFallback className="text-2xl font-medium text-secondary-foreground sm:text-3xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-medium text-ink sm:text-3xl dark:text-stone-100">
            {displayName}
          </h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {user.email}
          </p>
          <p className="section-body mt-5 max-w-2xl">
            {user.profile.bio?.trim() || 'No bio added yet.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function getInitials(name: string, email: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('')

  return (initials || email.charAt(0)).toUpperCase()
}
