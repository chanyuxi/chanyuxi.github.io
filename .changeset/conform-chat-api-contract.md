---
'introduction': patch
---

Bring the chat endpoint into the standard API pattern: move its request schema into `shared/contracts/chat`, return structured `{ error: { code, message } }` bodies with dedicated error codes, split the chat module into service/stream/handlers, and surface server error messages in the client.
