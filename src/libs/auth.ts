import type { ReactBetterAuthClient } from '@neondatabase/neon-js/auth'

import { createAuthClient } from '@neondatabase/neon-js/auth'
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react/adapters'

const neonAuthUrl = import.meta.env.VITE_NEON_AUTH_URL

if (!neonAuthUrl) {
  console.error(
    'VITE_NEON_AUTH_URL is not configured. Sign-in and API authorization will not work.',
  )
}

console.log(neonAuthUrl)

// The session cookie lives on the Neon Auth origin, so cross-origin
// requests must send credentials for session and token exchange to work.
export const authClient: ReactBetterAuthClient = createAuthClient(neonAuthUrl, {
  adapter: BetterAuthReactAdapter({
    fetchOptions: { credentials: 'include' },
  }),
})

const NO_SESSION_CACHE_MS = 10_000
const TOKEN_EXPIRY_MARGIN_MS = 60_000

interface AccessTokenCache {
  expiresAt: number
  token: string
}

let cachedAccessToken: AccessTokenCache | undefined
let noSessionUntil = 0
let pendingAccessToken: Promise<null | string> | undefined

export async function getAccessToken(): Promise<null | string> {
  const now = Date.now()

  if (
    cachedAccessToken
    && now < cachedAccessToken.expiresAt - TOKEN_EXPIRY_MARGIN_MS
  ) {
    return cachedAccessToken.token
  }

  if (now < noSessionUntil) {
    return null
  }

  pendingAccessToken ??= fetchAccessToken()
    .then((token) => {
      const expiresAt = token ? readTokenExpiry(token) : undefined

      cachedAccessToken = token && expiresAt
        ? { expiresAt, token }
        : undefined

      if (!token) {
        noSessionUntil = now + NO_SESSION_CACHE_MS
      }

      return token
    })
    .finally(() => {
      pendingAccessToken = undefined
    })

  return pendingAccessToken
}

export function resetAccessToken() {
  cachedAccessToken = undefined
  noSessionUntil = 0
}

// The managed service stores a JWT as the session token, so the value
// returned by getSession can be attached to API requests as-is.
async function fetchAccessToken() {
  const { data } = await authClient.getSession()

  return data?.session.token ?? null
}

function readTokenExpiry(token: string): number | undefined {
  const segment = token.split('.')[1]

  if (!segment) {
    return undefined
  }

  try {
    const base64 = segment
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(segment.length + ((4 - (segment.length % 4)) % 4), '=')
    const claims = JSON.parse(atob(base64)) as { exp?: unknown }

    return typeof claims.exp === 'number' ? claims.exp * 1000 : undefined
  }
  catch {
    return undefined
  }
}
