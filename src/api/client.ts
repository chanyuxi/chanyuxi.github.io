import type { ApiSchemaConfig } from './schema'

import axios from 'axios'

import { ApiError } from './error'
import { normalizeApiError, unwrapResponse } from './response'

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

apiClient.interceptors.request.use(async (config) => {
  const { requestSchema, requireAuth } = config as ApiSchemaConfig & typeof config

  if (requestSchema) {
    const result = requestSchema.safeParse(config.data)

    if (!result.success) {
      throw ApiError.contract('The API request has an invalid format')
    }

    config.data = result.data
  }

  // The auth library is imported lazily so anonymous visitors never
  // download the auth client bundle for public endpoints.
  if (requireAuth) {
    const { getAccessToken } = await import('@/libs/auth')
    const token = await getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    const { responseSchema } = response.config as ApiSchemaConfig & typeof response.config

    if (responseSchema) {
      response.data = unwrapResponse(response.data, responseSchema)
    }

    return response
  },
  async (error: unknown) => {
    if (axios.isCancel(error)) return Promise.reject(error)

    // A cached token can outlive a sign-out in another tab. Reset the
    // cache and retry once with a fresh token before surfacing the error.
    if (
      axios.isAxiosError(error)
      && error.response?.status === 401
      && error.config?.headers?.get('Authorization')
    ) {
      const config = error.config as {
        retriedAfterAuth?: boolean
      } & typeof error.config

      if (!config.retriedAfterAuth) {
        config.retriedAfterAuth = true

        const { resetAccessToken } = await import('@/libs/auth')
        resetAccessToken()

        return apiClient.request(config)
      }
    }

    return Promise.reject(normalizeApiError(error))
  },
)
