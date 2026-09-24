import { apiErrorResponseSchema } from '@shared/contracts/api'
import axios from 'axios'
import { z, type ZodType } from 'zod'

import { ApiError, ApiErrorKind } from './error'

export function normalizeApiError(error: unknown) {
  if (error instanceof ApiError) return error

  if (!axios.isAxiosError(error)) {
    return ApiError.contract(
      error instanceof Error ? error.message : 'Unexpected request error',
    )
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ApiError('Request timed out', ApiErrorKind.Timeout)
  }

  if (!error.response) {
    return new ApiError('Network request failed', ApiErrorKind.Network)
  }

  const response = readErrorResponse(error.response.data)

  return new ApiError(
    response?.error.message || error.message || 'Request failed',
    ApiErrorKind.Http,
    error.response.status,
    response?.error.code ?? null,
  )
}

export function unwrapResponse<T>(payload: unknown, schema: ZodType<T>): T {
  const result = z.object({ data: schema }).safeParse(payload)

  if (!result.success) {
    throw ApiError.contract('The API response has an invalid format')
  }

  return result.data.data
}

function readErrorResponse(payload: unknown) {
  const result = apiErrorResponseSchema.safeParse(payload)

  return result.success ? result.data : null
}
