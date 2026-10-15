import { z } from 'zod'

import {
  MAX_PROFILE_AVATAR_ENCODED_LENGTH,
  MAX_PROFILE_BIO_LENGTH,
} from '../constants/user-profiles.js'
import { USER_ROLES } from '../constants/user-roles.js'

export const AuthErrorCode = {
  Unauthenticated: 'UNAUTHENTICATED',
} as const

export const ProfileSetupErrorCode = {
  InvalidRequest: 'PROFILE_SETUP_INVALID',
  StorageUnavailable: 'PROFILE_SETUP_STORAGE_UNAVAILABLE',
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
  isProfileInitialized: z.boolean(),
  role: z.enum(USER_ROLES),
})

export const meSchema = verifiedUserSchema.extend({
  profile: meProfileSchema,
})

// Body of the one-time Profile Setup completion request. The avatar is a
// data URL exported from the crop editor canvas, optional because the
// initials fallback already exists. Bio is required so the flow cannot be
// skipped empty.
export const profileSetupRequestSchema = z.object({
  avatar: z
    .string()
    .startsWith('data:image/')
    .max(MAX_PROFILE_AVATAR_ENCODED_LENGTH)
    .optional(),
  bio: z.string().trim().min(1).max(MAX_PROFILE_BIO_LENGTH),
})

export type Me = z.infer<typeof meSchema>
export type MeProfile = z.infer<typeof meProfileSchema>
export type ProfileSetupRequest = z.infer<typeof profileSetupRequestSchema>
export type VerifiedUser = z.infer<typeof verifiedUserSchema>
