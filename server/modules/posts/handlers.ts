import type { PostService } from './service.js'

import {
  createPostRequestSchema,
  PostErrorCode,
  postIdSchema,
  postListQuerySchema,
  publishPostRequestSchema,
  updatePostRequestSchema,
} from '../../../shared/contracts/posts.js'
import { requireVerifiedUser } from '../../core/auth.js'
import {
  defineApiHandler,
  HttpError,
  parseJsonBody,
  successResponse,
} from '../../core/http.js'

const invalidRequestMessage = 'The post request has an invalid format'
const invalidListMessage = 'The post list query is invalid'

const PUBLIC_POSTS_CACHE = 'public, max-age=30, stale-while-revalidate=60'

export function createPostCollectionHandlers(service: PostService) {
  const GET = defineApiHandler(
    'posts.list',
    async (request) => {
      const parsed = parseListQuery(request)

      return successResponse(
        {
          items: await service.listPublished(
            parsed.limit,
            parsed.offset,
            parsed.search,
          ),
        },
        PUBLIC_POSTS_CACHE,
      )
    },
  )

  const POST = defineApiHandler(
    'posts.create',
    async (request) => {
      const user = await requireVerifiedUser(request)
      const body = await parseJsonBody(request, createPostRequestSchema, {
        code: PostErrorCode.InvalidRequest,
        message: invalidRequestMessage,
      })

      return successResponse(await service.create(user.id, body, user.name))
    },
  )

  return { GET, POST }
}

export function createPostItemHandlers(service: PostService) {
  const GET = defineApiHandler(
    'posts.editor.read',
    async (request) => {
      const user = await requireVerifiedUser(request)

      return successResponse(
        await service.getEditor(user.id, readPostId(request)),
      )
    },
  )

  const PATCH = defineApiHandler(
    'posts.update',
    async (request) => {
      const user = await requireVerifiedUser(request)
      const body = await parseJsonBody(request, updatePostRequestSchema, {
        code: PostErrorCode.InvalidRequest,
        message: invalidRequestMessage,
      })

      return successResponse(
        await service.update(user.id, readPostId(request), body),
      )
    },
  )

  const DELETE = defineApiHandler(
    'posts.delete',
    async (request) => {
      const user = await requireVerifiedUser(request)
      const id = readPostId(request)

      await service.delete(user.id, id)

      return successResponse({ id })
    },
  )

  return { DELETE, GET, PATCH }
}

export function createPostMineHandlers(service: PostService) {
  const GET = defineApiHandler(
    'posts.mine',
    async (request) => {
      const user = await requireVerifiedUser(request)
      const parsed = parseListQuery(request)

      return successResponse({
        items: await service.listMine(user.id, parsed.limit, parsed.offset),
      })
    },
  )

  return { GET }
}

export function createPostPublicHandlers(service: PostService) {
  const GET = defineApiHandler(
    'posts.public.read',
    async request => successResponse(
      await service.getPublic(readPathSegment(request)),
      PUBLIC_POSTS_CACHE,
    ),
  )

  return { GET }
}

export function createPostPublishHandler(service: PostService) {
  const POST = defineApiHandler(
    'posts.publish',
    async (request) => {
      const user = await requireVerifiedUser(request)
      const body = await parseJsonBody(request, publishPostRequestSchema, {
        code: PostErrorCode.InvalidRequest,
        message: invalidRequestMessage,
      })

      return successResponse(
        await service.publish(user.id, readPostId(request, 2), body.version),
      )
    },
  )

  return { POST }
}

function parseListQuery(request: Request) {
  const url = new URL(request.url)
  const parsed = postListQuerySchema.safeParse({
    limit: url.searchParams.get('limit') ?? undefined,
    offset: url.searchParams.get('offset') ?? undefined,
    search: url.searchParams.get('search') ?? undefined,
  })

  if (!parsed.success) {
    throw new HttpError(400, PostErrorCode.InvalidRequest, invalidListMessage)
  }

  return parsed.data
}

function readPathSegment(request: Request, offsetFromEnd = 1) {
  const segments = new URL(request.url).pathname.split('/').filter(Boolean)
  const value = segments.at(-offsetFromEnd)

  if (!value) {
    throw new HttpError(400, PostErrorCode.InvalidRequest, invalidRequestMessage)
  }

  try {
    return decodeURIComponent(value)
  }
  catch {
    // Malformed percent-encoding must not surface as a server error.
    throw new HttpError(400, PostErrorCode.InvalidRequest, invalidRequestMessage)
  }
}

function readPostId(request: Request, offsetFromEnd = 1) {
  const value = readPathSegment(request, offsetFromEnd)
  const parsed = postIdSchema.safeParse(value)

  if (!parsed.success) {
    throw new HttpError(400, PostErrorCode.InvalidRequest, invalidRequestMessage)
  }

  return parsed.data
}
