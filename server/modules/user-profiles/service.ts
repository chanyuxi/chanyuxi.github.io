import type { MeProfile, ProfileSetupRequest } from '../../../shared/contracts/auth.js'
import type { UserProfile } from '../../db/schema/index.js'
import type { UserProfileRepository } from './repository.js'

import { putPublicObject } from '../../core/storage.js'

import { decodeAvatarDataUrl } from './avatar.js'

export interface UserProfileService {
  completeSetup: (userId: string, request: ProfileSetupRequest) => Promise<MeProfile>
  getOrCreateProfile: (userId: string) => Promise<MeProfile>
}

export function createUserProfileService(
  repository: UserProfileRepository,
): UserProfileService {
  return {
    async completeSetup(userId, request) {
      let avatarUrl: string | undefined

      if (request.avatar) {
        const avatar = decodeAvatarDataUrl(request.avatar)
        const key = `avatars/${userId}/${avatar.contentHash}.${avatar.extension}`
        const stored = await putPublicObject(
          key,
          avatar.bytes,
          avatar.contentType,
        )

        avatarUrl = stored.url
      }

      const profile = await repository.upsertByUserId(userId, {
        bio: request.bio,
        isProfileInitialized: true,
        ...(avatarUrl ? { avatarUrl } : {}),
      })

      return toMeProfile(profile)
    },

    async getOrCreateProfile(userId) {
      const profile = await repository.getOrCreateByUserId(userId)

      return toMeProfile(profile)
    },
  }
}

function toMeProfile(profile: UserProfile): MeProfile {
  return {
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
    displayName: profile.displayName,
    isProfileInitialized: profile.isProfileInitialized,
    role: profile.role,
  }
}
