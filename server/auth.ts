import type { Me } from '../shared/contracts/auth.js'
import type { JWTPayload } from 'jose'

import { createRemoteJWKSet, jwtVerify } from 'jose'

import { AuthErrorCode } from '../shared/contracts/auth.js'

import { HttpError } from './http.js'

const BEARER_PREFIX = 'Bearer '

const invalidSessionMessage
  = 'The sign-in session is missing, invalid, or expired'

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined

export async function requireVerifiedUser(request: Request): Promise<Me> {
  const authorization = request.headers.get('authorization')

  if (!authorization?.startsWith(BEARER_PREFIX)) {
    throw new HttpError(
      401,
      AuthErrorCode.Unauthenticated,
      'Sign in with email and password to continue',
    )
  }

  const baseUrl = getAuthBaseUrl()
  const origin = new URL(baseUrl).origin
  const token = authorization.slice(BEARER_PREFIX.length)

  let payload: JWTPayload

  try {
    const result = await jwtVerify(token, getJwks(), {
      algorithms: ['EdDSA'],
      audience: origin,
    })

    payload = result.payload
  }
  catch {
    throw new HttpError(401, AuthErrorCode.Unauthenticated, invalidSessionMessage)
  }

  // The managed service mints `iss` with the full auth URL (including the
  // database path). Accept the bare origin as well to stay resilient to
  // either format.
  if (payload.iss !== baseUrl && payload.iss !== origin) {
    throw new HttpError(401, AuthErrorCode.Unauthenticated, invalidSessionMessage)
  }

  if (payload.banned === true) {
    throw new HttpError(401, AuthErrorCode.Unauthenticated, invalidSessionMessage)
  }

  const { email, name, sub: id } = payload

  if (typeof id !== 'string' || typeof email !== 'string' || typeof name !== 'string') {
    throw new HttpError(401, AuthErrorCode.Unauthenticated, invalidSessionMessage)
  }

  return { email, id, name }
}

function getAuthBaseUrl() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL

  if (!baseUrl) {
    throw new Error('NEON_AUTH_BASE_URL is not configured')
  }

  return baseUrl
}

function getJwks() {
  jwks ??= createRemoteJWKSet(
    new URL(`${getAuthBaseUrl()}/.well-known/jwks.json`),
  )

  return jwks
}
