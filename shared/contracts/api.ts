import { z } from 'zod'

export interface ApiSuccessResponse<T> {
  data: T
}

export const apiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>
