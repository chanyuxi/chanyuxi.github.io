---
'introduction': patch
---

Add shared server environment guards (`requireEnv`, `optionalEnv`) in `server/core/env` and use them across the database, auth, and chat modules instead of hand-rolled checks.
