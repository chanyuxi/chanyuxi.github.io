---
'introduction': patch
---

fixed: Stop replaying doomed 401s — API requests only retry with a genuinely fresh session token, and the me query no longer retries rejected sessions.
