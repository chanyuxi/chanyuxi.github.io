import type { SiteLikes } from '../../shared/contracts/site-likes.js'
import type { SiteLikesRepository } from './repository.js'

export interface SiteLikesService {
  getSiteLikes: () => Promise<SiteLikes>
  incrementSiteLikes: (increment: number) => Promise<SiteLikes>
}

export function createSiteLikesService(
  repository: SiteLikesRepository,
): SiteLikesService {
  return {
    async getSiteLikes() {
      return { count: await repository.getCount() }
    },
    async incrementSiteLikes(increment) {
      return { count: await repository.increment(increment) }
    },
  }
}
