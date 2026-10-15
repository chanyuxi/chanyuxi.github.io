import { drizzle } from 'drizzle-orm/neon-http'

import { requireEnv } from '../core/env.js'

let database: ReturnType<typeof drizzle> | undefined

export function getDatabase() {
  if (database) {
    return database
  }

  database = drizzle(requireEnv('NEON_DATABASE_URL'))

  return database
}
