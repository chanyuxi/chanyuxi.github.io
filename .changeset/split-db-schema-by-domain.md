---
'introduction': patch
---

Split the database schema into per-domain files (`site-likes`, `user-profiles`, `likes`) under `server/db/schema` with a barrel index, and point drizzle-kit at the barrel.
