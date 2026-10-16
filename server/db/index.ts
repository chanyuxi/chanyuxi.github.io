// `drizzle-orm/neon-http` imports the Neon HTTP driver from
// `@neondatabase/serverless` at runtime (an optional peer of drizzle-orm),
// so that package stays in `dependencies` even though no project file
// imports it directly.
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
