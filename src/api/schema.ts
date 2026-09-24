import type { AxiosRequestConfig } from 'axios'
import type { ZodType } from 'zod'

export interface ApiRequestConfig<TResponse, TData = unknown>
  extends AxiosRequestConfig<TData> {
  requestSchema?: ZodType<TData>
  responseSchema: ZodType<TResponse>
}

export interface ApiSchemaConfig<TResponse = unknown, TData = unknown> {
  requestSchema?: ZodType<TData>
  responseSchema?: ZodType<TResponse>
}
