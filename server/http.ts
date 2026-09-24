import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from '../shared/contracts/api.js'
import type { ZodType } from 'zod'

const responseHeaders = {
  'Cache-Control': 'no-store',
}

export type ApiHandler = (request: Request) => Promise<Response> | Response

export interface ApiLogger {
  error: (message: string, context: unknown) => void
}

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export function defineApiHandler(
  operation: string,
  handler: ApiHandler,
  logger: ApiLogger = console,
): ApiHandler {
  return async (request) => {
    try {
      return await handler(request)
    }
    catch (error) {
      if (error instanceof HttpError) {
        return errorResponse(error.status, error.code, error.message)
      }

      logger.error('API request failed', {
        error,
        method: request.method,
        operation,
        url: request.url,
      })

      return errorResponse(
        500,
        'INTERNAL_ERROR',
        'Unable to process the request',
      )
    }
  }
}

export function errorResponse(status: number, code: string, message: string) {
  const body: ApiErrorResponse = {
    error: { code, message },
  }

  return Response.json(body, { headers: responseHeaders, status })
}

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
  failure: { code: string, message: string },
) {
  let payload: unknown

  try {
    payload = await request.json()
  }
  catch {
    throw new HttpError(400, failure.code, failure.message)
  }

  const result = schema.safeParse(payload)

  if (!result.success) {
    throw new HttpError(400, failure.code, failure.message)
  }

  return result.data
}

export function successResponse<T>(data: T) {
  const body: ApiSuccessResponse<T> = { data }

  return Response.json(body, { headers: responseHeaders })
}
