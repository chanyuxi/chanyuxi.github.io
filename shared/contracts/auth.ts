import { z } from 'zod'

import { USER_ROLES } from '../constants/user-roles.js'

export const AuthErrorCode = {
  Unauthenticated: 'UNAUTHENTICATED',
} as const

// The identity claims verified from the Neon Auth JWT, without any
// app-owned data.
export const verifiedUserSchema = z.object({
  email: z.string(),
  id: z.string(),
  name: z.string(),
})

// The app-owned profile view attached to the current user.
export const meProfileSchema = z.object({
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  displayName: z.string().nullable(),
  role: z.enum(USER_ROLES),
})

export const meSchema = verifiedUserSchema.extend({
  profile: meProfileSchema,
})

export type Me = z.infer<typeof meSchema>
export type MeProfile = z.infer<typeof meProfileSchema>
export type VerifiedUser = z.infer<typeof verifiedUserSchema>
