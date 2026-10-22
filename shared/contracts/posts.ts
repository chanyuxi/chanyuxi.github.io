import type { CompiledMarkdownNode } from '../markdown/compile.js'

import { z } from 'zod'

import {
  MAX_POST_CONTENT_LENGTH,
  MAX_POST_DESCRIPTION_LENGTH,
  MAX_POST_SEARCH_LENGTH,
  MAX_POST_TAG_LENGTH,
  MAX_POST_TAGS,
  MAX_POST_TITLE_LENGTH,
  POST_PAGE_SIZE,
  POST_SLUG_MAX_LENGTH,
  POST_STATUSES,
} from '../constants/posts.js'

export const PostErrorCode = {
  Conflict: 'POST_CONFLICT',
  Forbidden: 'POST_FORBIDDEN',
  InvalidRequest: 'POST_INVALID',
  Limit: 'POST_LIMIT',
  NotFound: 'POST_NOT_FOUND',
} as const

export const postStatusSchema = z.enum(POST_STATUSES)

export const postIdSchema = z.string().uuid()

export const postSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(POST_SLUG_MAX_LENGTH)
  .regex(
    /^[\p{Letter}\p{Number}-]+$/u,
    'Use letters, numbers, and hyphens only',
  )

const compiledMarkdownNodeSchema: z.ZodType<CompiledMarkdownNode> = z.lazy(() =>
  z.union([
    z.string(),
    z.object({
      children: z.array(compiledMarkdownNodeSchema),
      properties: z.record(
        z.string(),
        z.union([z.boolean(), z.number(), z.string()]),
      ),
      tag: z.string(),
    }),
  ]),
)

export const postAuthorSchema = z.object({
  avatarUrl: z.string().nullable(),
  displayName: z.string().nullable(),
  id: z.string(),
})

export const postSummarySchema = z.object({
  author: postAuthorSchema,
  createdAt: z.string(),
  description: z.string().nullable(),
  id: z.string(),
  publishedAt: z.string().nullable(),
  slug: z.string(),
  status: postStatusSchema,
  tags: z.array(z.string()),
  title: z.string(),
  updatedAt: z.string(),
})

export const postDetailSchema = postSummarySchema.extend({
  content: z.array(compiledMarkdownNodeSchema),
})

export const postEditorSchema = postSummarySchema.extend({
  compilerVersion: z.number().int(),
  contentMd: z.string(),
  version: z.number().int(),
})

export const postListSchema = z.object({
  items: z.array(postSummarySchema),
})

export const createPostRequestSchema = z.object({
  contentMd: z.string().max(MAX_POST_CONTENT_LENGTH).optional(),
  description: z.string().trim().max(MAX_POST_DESCRIPTION_LENGTH).optional(),
  slug: postSlugSchema.optional(),
  tags: z.array(z.string().trim().min(1).max(MAX_POST_TAG_LENGTH)).max(MAX_POST_TAGS).optional(),
  title: z.string().trim().min(1).max(MAX_POST_TITLE_LENGTH),
})

export const updatePostRequestSchema = z.object({
  contentMd: z.string().max(MAX_POST_CONTENT_LENGTH).optional(),
  description: z.string().trim().max(MAX_POST_DESCRIPTION_LENGTH).nullable().optional(),
  slug: postSlugSchema.optional(),
  tags: z.array(z.string().trim().min(1).max(MAX_POST_TAG_LENGTH)).max(MAX_POST_TAGS).optional(),
  title: z.string().trim().min(1).max(MAX_POST_TITLE_LENGTH).optional(),
  version: z.number().int().positive(),
})

export const publishPostRequestSchema = z.object({
  version: z.number().int().positive(),
})

export const postListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(POST_PAGE_SIZE),
  offset: z.coerce.number().int().min(0).max(10_000).default(0),
  search: z.string().trim().max(MAX_POST_SEARCH_LENGTH).default(''),
})

export const deletePostResponseSchema = z.object({
  id: z.string(),
})

export type CreatePostRequest = z.infer<typeof createPostRequestSchema>
export type PostAuthor = z.infer<typeof postAuthorSchema>
export type PostDetail = z.infer<typeof postDetailSchema>
export type PostEditor = z.infer<typeof postEditorSchema>
export type PostList = z.infer<typeof postListSchema>
export type PostSummary = z.infer<typeof postSummarySchema>
export type PublishPostRequest = z.infer<typeof publishPostRequestSchema>
export type UpdatePostRequest = z.infer<typeof updatePostRequestSchema>
