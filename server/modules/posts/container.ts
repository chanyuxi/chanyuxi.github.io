import { createPostRepository } from './repository.js'
import { createPostService } from './service.js'

// Single wiring for every /api/posts entry file so the repository and service
// are assembled in exactly one place.
const repository = createPostRepository()
const service = createPostService(repository)

export const postService = service
