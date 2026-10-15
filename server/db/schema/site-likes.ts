import { sql } from 'drizzle-orm'
import { bigint, check, pgTable, smallint } from 'drizzle-orm/pg-core'

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
