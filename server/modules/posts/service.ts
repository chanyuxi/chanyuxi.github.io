import type {
  CreatePostRequest,
  PostDetail,
  PostEditor,
  PostSummary,
  UpdatePostRequest,
} from '../../../shared/contracts/posts.js'
import type { Post } from '../../db/schema/index.js'
import type {
  PostAuthorRecord,
  PostDetailRecord,
  PostRepository,
  PostSummaryRecord,
} from './repository.js'

import { randomUUID } from 'node:crypto'

import { MAX_POST_TAGS, MAX_POSTS_PER_USER, RESERVED_POST_SLUGS } from '../../../shared/constants/posts.js'
import { PostErrorCode } from '../../../shared/contracts/posts.js'
import {
  compileMarkdown,
  MARKDOWN_COMPILER_VERSION,
} from '../../../shared/markdown/compile.js'
import { toPostSlug } from '../../../shared/utils/post-slug.js'
import { HttpError } from '../../core/http.js'

const postNotFoundMessage = 'Post not found'
const postForbiddenMessage = 'You do not have permission to edit this post'
const postConflictMessage = 'This post changed elsewhere. Reload it and try again.'
const postLimitMessage = `You have reached the limit of ${MAX_POSTS_PER_USER} posts`
const postSlugTakenMessage = 'This slug is already taken. Choose another one.'

const SLUG_UNIQUE_CONSTRAINT = 'posts_slug_unique'
const MAX_SLUG_ATTEMPTS = 50

export interface PostService {
  create: (
    userId: string,
    request: CreatePostRequest,
    authorName?: string,
  ) => Promise<PostEditor>
  delete: (userId: string, id: string) => Promise<void>
  getEditor: (userId: string, id: string) => Promise<PostEditor>
  getPublic: (slug: string) => Promise<PostDetail>
  listMine: (userId: string, limit: number, offset: number) => Promise<PostSummary[]>
  listPublished: (limit: number, offset: number, search: string) => Promise<PostSummary[]>
  publish: (userId: string, id: string, version: number) => Promise<PostSummary>
  update: (
    userId: string,
    id: string,
    request: UpdatePostRequest,
  ) => Promise<PostEditor>
}

export function createPostService(
  repository: PostRepository,
): PostService {
  async function getEditablePost(userId: string, id: string) {
    const post = await repository.getById(id)

    if (!post) {
      throw notFound()
    }

    // Fast path: the author needs no role lookup.
    if (post.author.id !== userId) {
      const role = await repository.getRole(userId)

      if (role !== 'admin' && role !== 'owner') {
        throw new HttpError(
          403,
          PostErrorCode.Forbidden,
          postForbiddenMessage,
        )
      }
    }

    return post
  }

  async function resolveSlug(base: string, excludeId?: string) {
    const requested = toPostSlug(base)
    const root = RESERVED_POST_SLUGS.has(requested)
      ? `${requested}-post`
      : requested

    // Ask once which of the finite candidates already exist, then pick the
    // first free one; a prefix query could hide the exact matches behind
    // longer slugs.
    const candidates = [root]

    for (let attempt = 2; attempt <= MAX_SLUG_ATTEMPTS; attempt += 1) {
      candidates.push(`${root}-${attempt}`)
    }

    const taken = new Set(await repository.findExistingSlugs(candidates, excludeId))
    const free = candidates.find(candidate => !taken.has(candidate))

    return free ?? `${root}-${randomUUID().slice(0, 8)}`
  }

  async function compile(contentMd: string) {
    return compileMarkdown(contentMd, {
      mode: 'post',
      sanitize: true,
    })
  }

  function toEditor(post: PostDetailRecord): PostEditor {
    return {
      ...toSummary(post),
      compilerVersion: post.compilerVersion,
      contentMd: post.contentMd,
      version: post.version,
    }
  }

  // Serializes creates per author. The Neon HTTP driver has no interactive
  // transactions, so this in-process queue closes the count-then-insert race
  // within one server instance; across serverless instances the cap stays a
  // best-effort ceiling (a database trigger would be the airtight option).
  const createQueues = new Map<string, Promise<unknown>>()

  function serializePerAuthor<T>(userId: string, task: () => Promise<T>): Promise<T> {
    const tail = createQueues.get(userId) ?? Promise.resolve()
    const next = tail.then(task, task)
    const guarded = next.catch(() => {})

    createQueues.set(userId, guarded)
    void guarded.then(() => {
      if (createQueues.get(userId) === guarded) {
        createQueues.delete(userId)
      }
    })

    return next
  }

  return {
    async create(userId, request, authorName) {
      return serializePerAuthor(userId, async () => {
        const postCount = await repository.countByAuthor(userId)

        if (postCount >= MAX_POSTS_PER_USER) {
          throw new HttpError(403, PostErrorCode.Limit, postLimitMessage)
        }

        await repository.ensureAuthor(userId, authorName)

        const contentMd = request.contentMd ?? ''
        const baseSlug = request.slug ?? toPostSlug(request.title)
        const slug = await resolveSlug(baseSlug)
        const contentJson = await compile(contentMd)

        let created: Post

        try {
          created = await repository.create({
            authorId: userId,
            compilerVersion: MARKDOWN_COMPILER_VERSION,
            contentJson,
            contentMd,
            description: normalizeDescription(request.description),
            slug,
            tags: normalizeTags(request.tags),
            title: request.title,
          })
        }
        catch (error) {
          // A concurrent create may win the slug after our check. Retry once
          // with an unguessable suffix instead of surfacing a database error.
          if (!isUniqueViolation(error)) throw error

          created = await repository.create({
            authorId: userId,
            compilerVersion: MARKDOWN_COMPILER_VERSION,
            contentJson,
            contentMd,
            description: normalizeDescription(request.description),
            slug: `${slug}-${randomUUID().slice(0, 8)}`,
            tags: normalizeTags(request.tags),
            title: request.title,
          })
        }

        const post = await repository.getById(created.id)

        if (!post) {
          throw new Error('The database did not return the created post')
        }

        return toEditor(post)
      })
    },

    async delete(userId, id) {
      await getEditablePost(userId, id)
      await repository.delete(id)
    },

    async getEditor(userId, id) {
      return toEditor(await getEditablePost(userId, id))
    },

    async getPublic(slug) {
      const post = await repository.getBySlug(slug)

      if (!post || post.status !== 'published') {
        throw notFound()
      }

      let content = post.contentJson

      if (post.compilerVersion !== MARKDOWN_COMPILER_VERSION) {
        content = await compile(post.contentMd)
        await repository.updateCompiled(
          post.id,
          content,
          MARKDOWN_COMPILER_VERSION,
          post.version,
        )
      }

      return {
        ...toSummary(post),
        content,
      }
    },

    async listMine(userId, limit, offset) {
      const posts = await repository.listByAuthor(userId, limit, offset)

      return posts.map(toSummary)
    },

    async listPublished(limit, offset, search) {
      const posts = await repository.listPublished(limit, offset, search)

      return posts.map(toSummary)
    },

    async publish(userId, id, version) {
      const post = await getEditablePost(userId, id)

      if (post.version !== version) {
        throw conflict()
      }

      if (post.status === 'published') {
        return toSummary(post)
      }

      const published = await repository.publish(
        id,
        version,
        post.publishedAt ?? new Date(),
      )

      if (!published) {
        throw conflict()
      }

      return toSummary(summaryFromPost(published, post.author))
    },

    async update(userId, id, request) {
      const post = await getEditablePost(userId, id)

      if (post.version !== request.version) {
        throw conflict()
      }

      const patch: Parameters<PostRepository['update']>[2] = {}

      if (request.title !== undefined && request.title !== post.title) {
        patch.title = request.title
      }

      if (request.slug !== undefined && request.slug !== post.slug) {
        patch.slug = await resolveSlug(request.slug, id)
      }

      if (request.description !== undefined) {
        const description = normalizeDescription(request.description)

        if (description !== post.description) {
          patch.description = description
        }
      }

      if (request.tags !== undefined) {
        const tags = normalizeTags(request.tags)

        if (!areEqual(tags, post.tags)) {
          patch.tags = tags
        }
      }

      if (
        request.contentMd !== undefined
        && (request.contentMd !== post.contentMd
          || post.compilerVersion !== MARKDOWN_COMPILER_VERSION)
      ) {
        patch.contentMd = request.contentMd
        patch.contentJson = await compile(request.contentMd)
        patch.compilerVersion = MARKDOWN_COMPILER_VERSION
      }

      if (Object.keys(patch).length === 0) {
        return toEditor(post)
      }

      let updated: Post | undefined

      try {
        updated = await repository.update(id, request.version, patch)
      }
      catch (error) {
        // A concurrent save may steal the slug between our probe and the
        // write; surface it as a conflict instead of a database error.
        if (isUniqueViolation(error)) {
          throw new HttpError(409, PostErrorCode.Conflict, postSlugTakenMessage)
        }

        throw error
      }

      if (!updated) {
        throw conflict()
      }

      // The author row cannot change through an update, so the response is
      // assembled from the write result instead of re-reading the post.
      return toEditor(detailFromPost(updated, post.author))
    },
  }
}

function areEqual(left: string[], right: string[]) {
  return left.length === right.length
    && left.every((value, index) => value === right[index])
}

function conflict() {
  return new HttpError(409, PostErrorCode.Conflict, postConflictMessage)
}

function detailFromPost(
  post: Post,
  author: PostAuthorRecord,
): PostDetailRecord {
  return {
    ...summaryFromPost(post, author),
    compilerVersion: post.compilerVersion,
    contentJson: post.contentJson,
    contentMd: post.contentMd,
    version: post.version,
  }
}

function isUniqueViolation(error: unknown) {
  // The Neon HTTP session wraps driver failures in DrizzleQueryError, so the
  // PostgreSQL code lives somewhere on the cause chain.
  let current: unknown = error

  while (typeof current === 'object' && current !== null) {
    const candidate = current as {
      cause?: unknown
      code?: unknown
      constraint?: unknown
    }

    if (
      candidate.code === '23505'
      && (candidate.constraint === SLUG_UNIQUE_CONSTRAINT
        || candidate.constraint === undefined)
    ) {
      return true
    }

    current = candidate.cause
  }

  return false
}

function normalizeDescription(value: null | string | undefined) {
  const description = value?.trim()

  return description ? description : null
}

function normalizeTags(tags: string[] | undefined) {
  if (!tags) return []

  return [...new Set(tags.map(tag => tag.trim()).filter(Boolean))]
    .slice(0, MAX_POST_TAGS)
}

function notFound() {
  return new HttpError(404, PostErrorCode.NotFound, postNotFoundMessage)
}

/**
 * Assembles a summary from a raw post row plus the author read before the
 * write, avoiding a joined re-read after update/publish.
 */
function summaryFromPost(
  post: Post,
  author: PostAuthorRecord,
): PostSummaryRecord {
  return {
    author,
    createdAt: post.createdAt,
    description: post.description,
    id: post.id,
    publishedAt: post.publishedAt,
    slug: post.slug,
    status: post.status,
    tags: post.tags,
    title: post.title,
    updatedAt: post.updatedAt,
  }
}

function toSummary(post: PostSummaryRecord): PostSummary {
  return {
    author: post.author,
    createdAt: post.createdAt.toISOString(),
    description: post.description,
    id: post.id,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    slug: post.slug,
    status: post.status,
    tags: post.tags,
    title: post.title,
    updatedAt: post.updatedAt.toISOString(),
  }
}
