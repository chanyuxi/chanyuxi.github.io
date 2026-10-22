import type { PostStatus } from '../../../shared/constants/posts.js'
import type { UserRole } from '../../../shared/constants/user-roles.js'
import type { Post } from '../../db/schema/index.js'

import { and, desc, eq, ilike, inArray, ne, or, sql } from 'drizzle-orm'

import { getDatabase } from '../../db/index.js'
import { posts, userProfiles } from '../../db/schema/index.js'

export interface PostAuthorRecord {
  avatarUrl: null | string
  displayName: null | string
  id: string
}

export interface PostCreateInput {
  authorId: string
  compilerVersion: number
  contentJson: Post['contentJson']
  contentMd: string
  description: null | string
  slug: string
  tags: string[]
  title: string
}

export interface PostDetailRecord extends PostSummaryRecord {
  compilerVersion: number
  contentJson: Post['contentJson']
  contentMd: string
  version: number
}

export interface PostSummaryRecord {
  author: PostAuthorRecord
  createdAt: Date
  description: null | string
  id: string
  publishedAt: Date | null
  slug: string
  status: PostStatus
  tags: string[]
  title: string
  updatedAt: Date
}

export interface PostUpdatePatch {
  compilerVersion?: number
  contentJson?: Post['contentJson']
  contentMd?: string
  description?: null | string
  slug?: string
  tags?: string[]
  title?: string
}

const summaryColumns = {
  authorAvatarUrl: userProfiles.avatarUrl,
  authorDisplayName: userProfiles.displayName,
  authorId: posts.authorId,
  createdAt: posts.createdAt,
  description: posts.description,
  id: posts.id,
  publishedAt: posts.publishedAt,
  slug: posts.slug,
  status: posts.status,
  tags: posts.tags,
  title: posts.title,
  updatedAt: posts.updatedAt,
}

const detailColumns = {
  ...summaryColumns,
  compilerVersion: posts.compilerVersion,
  contentJson: posts.contentJson,
  contentMd: posts.contentMd,
  version: posts.version,
}

export interface PostRepository {
  countByAuthor: (authorId: string) => Promise<number>
  create: (input: PostCreateInput) => Promise<Post>
  delete: (id: string) => Promise<void>
  ensureAuthor: (userId: string, displayName?: string) => Promise<void>
  findExistingSlugs: (slugs: string[], excludeId?: string) => Promise<string[]>
  getById: (id: string) => Promise<PostDetailRecord | undefined>
  getBySlug: (slug: string) => Promise<PostDetailRecord | undefined>
  getRole: (userId: string) => Promise<undefined | UserRole>
  listByAuthor: (authorId: string, limit: number, offset: number) => Promise<PostSummaryRecord[]>
  listPublished: (limit: number, offset: number, search: string) => Promise<PostSummaryRecord[]>
  publish: (id: string, expectedVersion: number, publishedAt: Date) => Promise<Post | undefined>
  update: (id: string, expectedVersion: number, patch: PostUpdatePatch) => Promise<Post | undefined>
  updateCompiled: (
    id: string,
    contentJson: Post['contentJson'],
    compilerVersion: number,
    expectedVersion: number,
  ) => Promise<void>
}

type DetailRow = {
  compilerVersion: number
  contentJson: Post['contentJson']
  contentMd: string
  version: number
} & SummaryRow

type SummaryRow = {
  authorAvatarUrl: null | string
  authorDisplayName: null | string
  authorId: string
  createdAt: Date
  description: null | string
  id: string
  publishedAt: Date | null
  slug: string
  status: PostStatus
  tags: string[]
  title: string
  updatedAt: Date
}

export function createPostRepository(
  databaseProvider: typeof getDatabase = getDatabase,
): PostRepository {
  return {
    async countByAuthor(authorId) {
      const [row] = await databaseProvider()
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(eq(posts.authorId, authorId))

      return row?.count ?? 0
    },

    async create(input) {
      const [post] = await databaseProvider()
        .insert(posts)
        .values(input)
        .returning()

      if (!post) {
        throw new Error('The database did not return the created post')
      }

      return post
    },

    async delete(id) {
      await databaseProvider().delete(posts).where(eq(posts.id, id))
    },

    async ensureAuthor(userId, displayName) {
      // The profile row owns the FK. Creating it here keeps a post attempt
      // from failing when the profile gate has not run yet. The auth name
      // seeds a display name only when the user has not chosen one.
      if (!displayName) {
        await databaseProvider()
          .insert(userProfiles)
          .values({ userId })
          .onConflictDoNothing({ target: userProfiles.userId })

        return
      }

      await databaseProvider()
        .insert(userProfiles)
        .values({ displayName, userId })
        .onConflictDoUpdate({
          set: {
            displayName: sql`coalesce(${userProfiles.displayName}, ${displayName})`,
          },
          target: userProfiles.userId,
        })
    },

    async findExistingSlugs(slugs, excludeId) {
      if (slugs.length === 0) return []

      const rows = await databaseProvider()
        .select({ slug: posts.slug })
        .from(posts)
        .where(
          excludeId
            ? and(inArray(posts.slug, slugs), ne(posts.id, excludeId))
            : inArray(posts.slug, slugs),
        )

      return rows.map(row => row.slug)
    },

    async getById(id) {
      const [post] = await databaseProvider()
        .select(detailColumns)
        .from(posts)
        .innerJoin(userProfiles, eq(posts.authorId, userProfiles.userId))
        .where(eq(posts.id, id))
        .limit(1)

      return post ? mapDetail(post) : undefined
    },

    async getBySlug(slug) {
      const [post] = await databaseProvider()
        .select(detailColumns)
        .from(posts)
        .innerJoin(userProfiles, eq(posts.authorId, userProfiles.userId))
        .where(eq(posts.slug, slug))
        .limit(1)

      return post ? mapDetail(post) : undefined
    },

    async getRole(userId) {
      const [profile] = await databaseProvider()
        .select({ role: userProfiles.role })
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1)

      return profile?.role
    },

    async listByAuthor(authorId, limit, offset) {
      const rows = await databaseProvider()
        .select(summaryColumns)
        .from(posts)
        .innerJoin(userProfiles, eq(posts.authorId, userProfiles.userId))
        .where(eq(posts.authorId, authorId))
        .orderBy(desc(posts.updatedAt), desc(posts.id))
        .limit(limit)
        .offset(offset)

      return rows.map(mapSummary)
    },

    async listPublished(limit, offset, search) {
      const pattern = `%${escapeLike(search)}%`
      const rows = await databaseProvider()
        .select(summaryColumns)
        .from(posts)
        .innerJoin(userProfiles, eq(posts.authorId, userProfiles.userId))
        .where(and(
          eq(posts.status, 'published'),
          search
            ? or(
                ilike(posts.title, pattern),
                ilike(posts.description, pattern),
                ilike(userProfiles.displayName, pattern),
                sql`array_to_string(${posts.tags}, ' ') ilike ${pattern}`,
              )
            : undefined,
        ))
        .orderBy(desc(posts.publishedAt), desc(posts.createdAt), desc(posts.id))
        .limit(limit)
        .offset(offset)

      return rows.map(mapSummary)
    },

    async publish(id, expectedVersion, publishedAt) {
      const [post] = await databaseProvider()
        .update(posts)
        .set({
          publishedAt,
          status: 'published',
          updatedAt: new Date(),
          version: sql`${posts.version} + 1`,
        })
        .where(and(eq(posts.id, id), eq(posts.version, expectedVersion)))
        .returning()

      return post
    },

    async update(id, expectedVersion, patch) {
      const [post] = await databaseProvider()
        .update(posts)
        .set({
          ...patch,
          updatedAt: new Date(),
          version: sql`${posts.version} + 1`,
        })
        .where(and(eq(posts.id, id), eq(posts.version, expectedVersion)))
        .returning()

      return post
    },

    async updateCompiled(id, contentJson, compilerVersion, expectedVersion) {
      // Version-guarded so a read that started from an older row can never
      // stamp its compile over content an author saved in the meantime.
      await databaseProvider()
        .update(posts)
        .set({ compilerVersion, contentJson })
        .where(and(eq(posts.id, id), eq(posts.version, expectedVersion)))
    },
  }
}

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, character => `\\${character}`)
}

function mapDetail(row: DetailRow): PostDetailRecord {
  return {
    ...mapSummary(row),
    compilerVersion: row.compilerVersion,
    contentJson: row.contentJson,
    contentMd: row.contentMd,
    version: row.version,
  }
}

function mapSummary(row: SummaryRow): PostSummaryRecord {
  return {
    author: {
      avatarUrl: row.authorAvatarUrl,
      displayName: row.authorDisplayName,
      id: row.authorId,
    },
    createdAt: row.createdAt,
    description: row.description,
    id: row.id,
    publishedAt: row.publishedAt,
    slug: row.slug,
    status: row.status,
    tags: row.tags,
    title: row.title,
    updatedAt: row.updatedAt,
  }
}
