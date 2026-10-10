import { eq, sql } from 'drizzle-orm'

import { getDatabase } from '../db/index.js'
import { SITE_LIKES_ID, siteLikes } from '../db/schema.js'

export interface SiteLikesRepository {
  getCount: () => Promise<number>
  increment: (increment: number) => Promise<number>
}

export function createSiteLikesRepository(
  databaseProvider: typeof getDatabase = getDatabase,
): SiteLikesRepository {
  return {
    async getCount() {
      const [result] = await databaseProvider()
        .select({ count: siteLikes.count })
        .from(siteLikes)
        .where(eq(siteLikes.id, SITE_LIKES_ID))
        .limit(1)

      return result?.count ?? 0
    },
    async increment(increment) {
      const [result] = await databaseProvider()
        .insert(siteLikes)
        .values({ count: increment, id: SITE_LIKES_ID })
        .onConflictDoUpdate({
          set: { count: sql`${siteLikes.count} + ${increment}` },
          target: siteLikes.id,
        })
        .returning({ count: siteLikes.count })

      if (!result) {
        throw new Error('The database did not return the updated site like count')
      }

      return result.count
    },
  }
}
