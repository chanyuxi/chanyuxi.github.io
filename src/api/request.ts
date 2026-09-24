import type { ApiRequestConfig } from './schema'

import { apiClient } from './client'

export function get<TResponse>(
  url: string,
  config: ApiRequestConfig<TResponse>,
) {
  return request<TResponse>({ ...config, method: 'GET', url })
}

export function post<TResponse, TData>(
  url: string,
  data: TData,
  config: ApiRequestConfig<TResponse, TData>,
) {
  return request<TResponse, TData>({ ...config, data, method: 'POST', url })
}

export async function request<TResponse, TData = unknown>(
  config: ApiRequestConfig<TResponse, TData>,
): Promise<TResponse> {
  const response = await apiClient.request<TResponse>(config)

  return response.data
}
