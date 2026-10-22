import { drizzle } from 'drizzle-orm/neon-http'

import { userProfiles, userRole } from '../server/db/schema/index.js'

const target = process.argv[2] === 'master' ? 'master' : 'dev'

const variableName = target === 'master'
  ? 'NEON_DATABASE_URL_MASTER'
  : 'NEON_DATABASE_URL'

const [rawUserId, rawRole] = process.argv.slice(target === 'master' ? 3 : 2)

try {
  process.loadEnvFile('.env')
}
catch {
  // .env is optional; Vercel and CI provide real environment variables.
}

if (
  !rawUserId
  || !rawRole
  || !(userRole.enumValues as readonly string[]).includes(rawRole)
) {
  console.error('Usage: pnpm db:set-role [master] <user-id> <user|admin|owner>')
  process.exit(1)
}

const databaseUrl = process.env[variableName]

if (!databaseUrl) {
  throw new Error(`${variableName} is not configured`)
}

if (!/^postgres(?:ql)?:\/\//.test(databaseUrl)) {
  throw new Error(`${variableName} does not look like a Postgres connection URL`)
}

const role = rawRole as typeof userRole.enumValues[number]

await drizzle(databaseUrl)
  .insert(userProfiles)
  .values({ role, userId: rawUserId })
  .onConflictDoUpdate({ set: { role }, target: userProfiles.userId })

console.log(`Role of user ${rawUserId} set to ${role} on the ${target} database`)
