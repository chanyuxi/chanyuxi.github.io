import type { MeProfile } from '../../shared/contracts/auth.js'
import type { UserProfileRepository } from './repository.js'

export interface UserProfileService {
  getOrCreateProfile: (userId: string) => Promise<MeProfile>
}

export function createUserProfileService(
  repository: UserProfileRepository,
): UserProfileService {
  return {
    async getOrCreateProfile(userId) {
      const profile = await repository.getOrCreateByUserId(userId)

      return {
        avatarUrl: profile.avatarUrl,
        bio: profile.bio,
        displayName: profile.displayName,
        role: profile.role,
      }
    },
  }
}
