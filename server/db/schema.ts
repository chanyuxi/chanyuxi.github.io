import { sql } from 'drizzle-orm'
import {
  bigint,
  check,
  index,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

import { DEFAULT_USER_ROLE, USER_ROLES } from '../../shared/constants/user-roles.js'

export const SITE_LIKES_ID = 1

export const siteLikes = pgTable(
  'site_likes',
  {
    count: bigint('count', { mode: 'number' }).default(0).notNull(),
    id: smallint('id').primaryKey(),
  },
  table => [
    check('site_likes_singleton_check', sql`${table.id} = ${SITE_LIKES_ID}`),
    check('site_likes_count_nonnegative_check', sql`${table.count} >= 0`),
  ],
)

// Roles are stored app-side, never inside Neon Auth user metadata (which users
// can edit), and joined by user id when authorizing requests.
export const userRole = pgEnum('user_role', USER_ROLES)

// Per-user like targets for future content. The anonymous site-wide like count
// lives in `site_likes` above and is intentionally not part of this table.
// Adding a content type later only needs `ALTER TYPE ... ADD VALUE`.
export const likeTargetType = pgEnum('like_target_type', [
  'poem',
  'post',
  'life_record',
])

export const userProfiles = pgTable('user_profiles', {
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  displayName: text('display_name'),
  role: userRole('role').default(DEFAULT_USER_ROLE).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
  // Matches the Neon Auth user id (the JWT `sub` claim).
  userId: uuid('user_id').primaryKey(),
})

export const likes = pgTable(
  'likes',
  {
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    id: uuid('id').defaultRandom().primaryKey(),
    targetId: text('target_id').notNull(),
    targetType: likeTargetType('target_type').notNull(),
    userId: uuid('user_id').notNull(),
  },
  table => [
    index('likes_target_idx').on(table.targetType, table.targetId),
    unique('likes_user_target_unique').on(
      table.userId,
      table.targetType,
      table.targetId,
    ),
  ],
)

export type Like = typeof likes.$inferSelect
export type LikeTargetType = typeof likeTargetType.enumValues[number]
export type UserProfile = typeof userProfiles.$inferSelect
