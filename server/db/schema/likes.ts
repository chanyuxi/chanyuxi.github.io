import { index, pgEnum, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'

// Per-user like targets for future content. The anonymous site-wide like
// count lives in `site_likes` and is intentionally not part of this table.
// Adding a content type later only needs `ALTER TYPE ... ADD VALUE`.
export const likeTargetType = pgEnum('like_target_type', [
  'poem',
  'post',
  'life_record',
])

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
