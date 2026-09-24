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

apiClient.interceptors.request.use((config) => {
  const { requestSchema } = config as ApiSchemaConfig & typeof config

  if (!requestSchema) return config

  const result = requestSchema.safeParse(config.data)

  if (!result.success) {
    throw ApiError.contract('The API request has an invalid format')
  }

  config.data = result.data

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
  (error: unknown) => {
    if (axios.isCancel(error)) return Promise.reject(error)

    return Promise.reject(normalizeApiError(error))
  },
)
