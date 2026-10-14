// Single source of truth for user roles, shared by the `user_role` database
// enum and the API contracts.
export const USER_ROLES = ['user', 'admin', 'owner'] as const

export const DEFAULT_USER_ROLE: UserRole = 'user'

export type UserRole = (typeof USER_ROLES)[number]
