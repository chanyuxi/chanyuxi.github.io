import { defineConfig } from 'drizzle-kit'

try {
  process.loadEnvFile('.env.local')
}
catch {
  // .env.local is optional; Vercel and CI provide real environment variables.
}

export default defineConfig({
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL ?? '',
  },
  dialect: 'postgresql',
  out: 'drizzle',
  schema: './server/db/schema/index.ts',
})
