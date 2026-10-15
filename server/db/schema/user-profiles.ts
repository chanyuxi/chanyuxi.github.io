import { boolean, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { DEFAULT_USER_ROLE, USER_ROLES } from '../../../shared/constants/user-roles.js'

// Roles are stored app-side, never inside Neon Auth user metadata (which users
// can edit), and joined by user id when authorizing requests.
export const userRole = pgEnum('user_role', USER_ROLES)

export const userProfiles = pgTable('user_profiles', {
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  displayName: text('display_name'),
  // Flips to true once the user completes the Profile Setup flow; gates the
  // client into /profile-setup while false. Existing rows are backfilled by
  // the adding migration so only new signups see the flow.
  isProfileInitialized: boolean('is_profile_initialized').default(false).notNull(),
  role: userRole('role').default(DEFAULT_USER_ROLE).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
  // Matches the Neon Auth user id (the JWT `sub` claim).
  userId: uuid('user_id').primaryKey(),
})

export type UserProfile = typeof userProfiles.$inferSelect
