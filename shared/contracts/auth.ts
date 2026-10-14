import { z } from 'zod'

export const AuthErrorCode = {
  Unauthenticated: 'UNAUTHENTICATED',
} as const

export const meSchema = z.object({
  email: z.string(),
  id: z.string(),
  name: z.string(),
})

export type Me = z.infer<typeof meSchema>
