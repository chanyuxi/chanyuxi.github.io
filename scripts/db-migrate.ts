import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

const target = process.argv[2] === 'master' ? 'master' : 'dev'

const variableName = target === 'master'
  ? 'NEON_DATABASE_URL_MASTER'
  : 'NEON_DATABASE_URL'

try {
  process.loadEnvFile('.env')
}
catch {
  // .env is optional; Vercel and CI provide real environment variables.
}

const databaseUrl = process.env[variableName]

if (!databaseUrl) {
  throw new Error(`${variableName} is not configured`)
}

if (!/^postgres(?:ql)?:\/\//.test(databaseUrl)) {
  throw new Error(`${variableName} does not look like a Postgres connection URL`)
}

const database = drizzle(databaseUrl)

console.log(`Applying database migrations from ./drizzle to the ${target} database`)

await migrate(database, { migrationsFolder: 'drizzle' })

console.log('Database migrations applied')
