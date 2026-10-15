import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { ProfileSetupErrorCode } from '../../shared/contracts/auth.js'

import { optionalEnv } from './env.js'
import { HttpError } from './http.js'

// Thin seam over Neon Object Storage (an S3-compatible API). Writes go
// through the branch's S3 endpoint; public URLs are derived from the
// endpoint plus the bucket name so they stay stable and cacheable when
// stored in the database. Only the connection is configured via the
// environment:
//   NEON_STORAGE_ENDPOINT, NEON_STORAGE_REGION,
//   NEON_STORAGE_ACCESS_KEY_ID, NEON_STORAGE_SECRET_ACCESS_KEY.
// Buckets are not secrets: register new content types in PUBLIC_BUCKETS
// below and create the matching bucket in the Neon Console (Object
// storage tab, access level public_read) — no extra environment variables.

// Registry of buckets whose objects are served at public URLs. Each key is
// the stable name call sites refer to; each value is the Neon bucket name.
export const PUBLIC_BUCKETS = {
  avatars: 'avatars',
} as const

export type PublicBucket = keyof typeof PUBLIC_BUCKETS

export interface StoredObject {
  key: string
  url: string
}

interface StorageConfig {
  accessKeyId: string
  endpoint: string
  region: string
  secretAccessKey: string
}

let client: S3Client | undefined
let config: StorageConfig | undefined

/** Whether object storage is configured so uploads can be served right now. */
export function isStorageConfigured(): boolean {
  return readConfig() !== undefined
}

/** Upload bytes under a content-hashed key and return its public URL. */
export async function putPublicObject(
  bucket: PublicBucket,
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<StoredObject> {
  const storageConfig = readConfig()

  if (!storageConfig) {
    throw storageUnavailable()
  }

  await getClient(storageConfig).send(
    new PutObjectCommand({
      // Content-hashed keys never change contents, so responses may be
      // cached aggressively by browsers and proxies.
      Body: body,
      Bucket: PUBLIC_BUCKETS[bucket],
      CacheControl: 'public, max-age=31536000, immutable',
      ContentType: contentType,
      Key: key,
    }),
  )

  return {
    key,
    url: `${storageConfig.endpoint}/${PUBLIC_BUCKETS[bucket]}/${key}`,
  }
}

function getClient(storageConfig: StorageConfig) {
  client ??= new S3Client({
    credentials: {
      accessKeyId: storageConfig.accessKeyId,
      secretAccessKey: storageConfig.secretAccessKey,
    },
    // Neon Object Storage requires path-style addressing.
    endpoint: storageConfig.endpoint,
    forcePathStyle: true,
    region: storageConfig.region,
  })

  return client
}

function readConfig(): StorageConfig | undefined {
  config ??= (() => {
    const endpoint = optionalEnv('NEON_STORAGE_ENDPOINT')
    const region = optionalEnv('NEON_STORAGE_REGION')
    const accessKeyId = optionalEnv('NEON_STORAGE_ACCESS_KEY_ID')
    const secretAccessKey = optionalEnv('NEON_STORAGE_SECRET_ACCESS_KEY')

    if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
      return undefined
    }

    return {
      accessKeyId,
      endpoint: endpoint.replace(/\/$/, ''),
      region,
      secretAccessKey,
    }
  })()

  return config
}

function storageUnavailable() {
  return new HttpError(
    503,
    ProfileSetupErrorCode.StorageUnavailable,
    'Avatar storage is temporarily unavailable. You can still continue without a photo.',
  )
}
