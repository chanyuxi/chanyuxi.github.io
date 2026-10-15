import type { UserProfile } from '../../db/schema/index.js'

import { eq } from 'drizzle-orm'

import { getDatabase } from '../../db/index.js'
import { userProfiles } from '../../db/schema/index.js'

export interface UserProfilePatch {
  avatarUrl?: string
  bio?: string
  isProfileInitialized?: boolean
}

export interface UserProfileRepository {
  getByUserId: (userId: string) => Promise<undefined | UserProfile>
  getOrCreateByUserId: (userId: string) => Promise<UserProfile>
  upsertByUserId: (userId: string, patch: UserProfilePatch) => Promise<UserProfile>
}

export function createUserProfileRepository(
  databaseProvider: typeof getDatabase = getDatabase,
): UserProfileRepository {
  async function getByUserId(userId: string) {
    const [profile] = await databaseProvider()
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1)

    return profile
  }

  async function getOrCreateByUserId(userId: string) {
    const existing = await getByUserId(userId)

    if (existing) {
      return existing
    }

    const [inserted] = await databaseProvider()
      .insert(userProfiles)
      .values({ userId })
      .onConflictDoNothing({ target: userProfiles.userId })
      .returning()

    // A concurrent first request may have won the insert; read the winner.
    const profile = inserted ?? await getByUserId(userId)

    if (!profile) {
      throw new Error('The database did not return the user profile')
    }

    return profile
  }

  async function upsertByUserId(userId: string, patch: UserProfilePatch) {
    // The conflict update only touches patched columns, so an absent
    // `avatarUrl` never wipes an existing one.
    const [upserted] = await databaseProvider()
      .insert(userProfiles)
      .values({ userId, ...patch })
      .onConflictDoUpdate({ set: patch, target: userProfiles.userId })
      .returning()

    if (!upserted) {
      throw new Error('The database did not return the user profile')
    }

    return upserted
  }

  return { getByUserId, getOrCreateByUserId, upsertByUserId }
}
