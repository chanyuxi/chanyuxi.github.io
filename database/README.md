# Database

Schema changes are managed with Drizzle Kit. The SQL files in this folder are
the legacy manual migration scripts from before Drizzle Kit was adopted and are
kept for reference only.

- Source of truth: `server/db/schema.ts`
- Generated migrations live in `drizzle/`
- Generate migrations: `pnpm db:generate`
- Apply to the dev branch: `pnpm db:migrate`
- Apply to the master branch: `pnpm db:migrate:master` (requires
  `NEON_DATABASE_URL_MASTER` in `.env`)
- Promote a user: `pnpm db:set-role [master] <user-id> <role>`

## Release checklist

Neon branches cannot be merged; schema changes travel by replaying the
migration files. Before every release that contains migration files:

1. Rehearse on the dev branch: `pnpm db:migrate`
2. Replay on the master branch: `pnpm db:migrate:master` — the master ledger
   skips anything it already recorded, so this is always safe to re-run
3. Replay any role or seed changes: `pnpm db:set-role:master <user-id> <role>`

Migrations must never run inside Vercel builds: preview deployments would
replay unreleased migrations against the production branch.
