import type { CompiledMarkdownNode } from '../../../shared/markdown/compile.js'

import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { POST_STATUSES } from '../../../shared/constants/posts.js'

import { userProfiles } from './user-profiles.js'

export const postStatus = pgEnum('post_status', POST_STATUSES)

export const posts = pgTable(
  'posts',
  {
    authorId: uuid('author_id')
      .notNull()
      .references(() => userProfiles.userId, { onDelete: 'cascade' }),
    // Compiled HAST nodes, rebuilt on every write so reads stay cheap. The
    // version lets a compiler upgrade invalidate cached output safely.
    compilerVersion: integer('compiler_version').notNull(),
    contentJson: jsonb('content_json')
      .$type<CompiledMarkdownNode[]>()
      .notNull(),
    contentMd: text('content_md').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    description: text('description'),
    id: uuid('id').defaultRandom().primaryKey(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    slug: text('slug').notNull(),
    status: postStatus('status').default('draft').notNull(),
    tags: text('tags').array().notNull(),
    title: text('title').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    version: integer('version').default(1).notNull(),
  },
  table => [
    index('posts_author_idx').on(table.authorId),
    index('posts_status_published_idx').on(table.status, table.publishedAt),
    uniqueIndex('posts_slug_unique').on(table.slug),
  ],
)

export type Post = typeof posts.$inferSelect
