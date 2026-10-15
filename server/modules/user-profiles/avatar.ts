import type { ProfileAvatarMimeType } from '../../../shared/constants/user-profiles.js'

import { createHash } from 'node:crypto'

import {
  MAX_PROFILE_AVATAR_BYTES,
  PROFILE_AVATAR_MIME_TYPES,
} from '../../../shared/constants/user-profiles.js'
import { ProfileSetupErrorCode } from '../../../shared/contracts/auth.js'
import { HttpError } from '../../core/http.js'

export interface DecodedAvatar {
  bytes: Uint8Array
  contentHash: string
  contentType: ProfileAvatarMimeType
  extension: string
}

const dataUrlPattern = /^data:(image\/(?:webp|png|jpeg));base64,([A-Za-z0-9+/=]+)$/

const magicBytes: Record<ProfileAvatarMimeType, Array<number>> = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
}

const extensions: Record<ProfileAvatarMimeType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

/**
 * Decode and validate an avatar data URL produced by the crop editor. The
 * declared MIME type is trusted only after the magic bytes confirm it, and
 * the content hash doubles as a cache-busting key part.
 */
export function decodeAvatarDataUrl(dataUrl: string): DecodedAvatar {
  const match = dataUrlPattern.exec(dataUrl)

  if (!match) {
    throw invalidAvatar()
  }

  const [, rawContentType, base64] = match
  const contentType = rawContentType as ProfileAvatarMimeType

  if (!PROFILE_AVATAR_MIME_TYPES.includes(contentType)) {
    throw invalidAvatar()
  }

  let bytes: Uint8Array

  try {
    bytes = new Uint8Array(
      atob(base64)
        .split('')
        .map(character => character.charCodeAt(0)),
    )
  }
  catch {
    throw invalidAvatar()
  }

  if (bytes.byteLength === 0 || bytes.byteLength > MAX_PROFILE_AVATAR_BYTES) {
    throw invalidAvatar()
  }

  if (!startsWith(bytes, magicBytes[contentType])) {
    throw invalidAvatar()
  }

  // WebP is a RIFF container; its second magic word sits at offset 8.
  if (contentType === 'image/webp' && !startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
    throw invalidAvatar()
  }

  return {
    bytes,
    contentHash: createHash('sha256').update(bytes).digest('hex').slice(0, 16),
    contentType,
    extension: extensions[contentType],
  }
}

function invalidAvatar(): HttpError {
  return new HttpError(
    400,
    ProfileSetupErrorCode.InvalidRequest,
    'The uploaded photo is not valid or is too large',
  )
}

function startsWith(bytes: Uint8Array, signature: Array<number>, offset = 0) {
  return signature.every((byte, index) => bytes[offset + index] === byte)
}
