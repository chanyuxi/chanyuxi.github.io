// Avatar editing constraints for the Profile Setup flow. The source file is
// bounded generously (camera photos); the exported crop stays small because
// the editor renders at fixed pixel dimensions.
export const MAX_AVATAR_SOURCE_BYTES = 8 * 1024 * 1024

export const AVATAR_SOURCE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

// Fixed circular crop frame. 208 + 2 x 20 border = 248px of canvas, which
// fits a 320px viewport with the setup card's mobile padding, and the
// export still covers every avatar display size up to 2x retina.
export const AVATAR_EDITOR_BORDER = 20
export const AVATAR_EDITOR_SIZE = 208

export const AVATAR_EXPORT_QUALITY = 0.9

export const AVATAR_MIN_SCALE = 1
export const AVATAR_MAX_SCALE = 3
