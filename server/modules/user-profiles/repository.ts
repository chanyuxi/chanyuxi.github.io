import type { UserProfile } from '../../db/schema/index.js'

import { eq } from 'drizzle-orm'

import { getDatabase } from '../../db/index.js'
import { userProfiles } from '../../db/schema/index.js'

export interface UserProfileRepository {
  getByUserId: (userId: string) => Promise<undefined | UserProfile>
  getOrCreateByUserId: (userId: string) => Promise<UserProfile>
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

  return { getByUserId, getOrCreateByUserId }
}
