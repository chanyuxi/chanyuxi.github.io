import { drizzle } from 'drizzle-orm/neon-http'

let database: ReturnType<typeof drizzle> | undefined

export function getDatabase() {
  if (database) {
    return database
  }

  const databaseUrl = process.env.NEON_DATABASE_URL

  if (!databaseUrl) {
    throw new Error('NEON_DATABASE_URL is not configured')
  }

  database = drizzle(databaseUrl)

  return database
}
