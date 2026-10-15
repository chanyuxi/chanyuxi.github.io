// Shared limits for the user profile and the Profile Setup flow.
export const MAX_PROFILE_BIO_LENGTH = 500

// The avatar travels as a base64 data URL, so the encoded length is what the
// contract bounds (~2 MB of decoded image bytes plus the base64 expansion).
export const MAX_PROFILE_AVATAR_ENCODED_LENGTH = 2_800_000

export const MAX_PROFILE_AVATAR_BYTES = 2 * 1024 * 1024

// MIME types the API accepts for avatar uploads. The crop editor exports
// WebP where supported, falling back to PNG or JPEG.
export const PROFILE_AVATAR_MIME_TYPES = [
  'image/webp',
  'image/png',
  'image/jpeg',
] as const

export type ProfileAvatarMimeType = (typeof PROFILE_AVATAR_MIME_TYPES)[number]
