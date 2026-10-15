import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { ProfileSetupErrorCode } from '../../shared/contracts/auth.js'

import { optionalEnv } from './env.js'
import { HttpError } from './http.js'

// Thin seam over Neon Object Storage (an S3-compatible API). Writes go
// through the branch's S3 endpoint; public URLs are built from the
// public_read base so they stay stable and cacheable when stored in the
// database. Configure via:
//   NEON_STORAGE_ENDPOINT, NEON_STORAGE_REGION, NEON_STORAGE_BUCKET,
//   NEON_STORAGE_ACCESS_KEY_ID, NEON_STORAGE_SECRET_ACCESS_KEY,
//   NEON_STORAGE_PUBLIC_BASE_URL (the bucket's public_read base).

export interface StoredObject {
  key: string
  url: string
}

interface StorageConfig {
  accessKeyId: string
  bucket: string
  endpoint: string
  publicBaseUrl: string
  region: string
  secretAccessKey: string
}

let client: S3Client | undefined
let config: StorageConfig | undefined

/** Whether avatar uploads can be served right now. */
export function isStorageConfigured(): boolean {
  return readConfig() !== undefined
}

/** Upload bytes under a content-hashed key and return its public URL. */
export async function putPublicObject(
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
      Bucket: storageConfig.bucket,
      CacheControl: 'public, max-age=31536000, immutable',
      ContentType: contentType,
      Key: key,
    }),
  )

  return {
    key,
    url: `${storageConfig.publicBaseUrl}/${key}`,
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
    const bucket = optionalEnv('NEON_STORAGE_BUCKET')
    const accessKeyId = optionalEnv('NEON_STORAGE_ACCESS_KEY_ID')
    const secretAccessKey = optionalEnv('NEON_STORAGE_SECRET_ACCESS_KEY')
    const publicBaseUrl = optionalEnv('NEON_STORAGE_PUBLIC_BASE_URL')

    if (
      !endpoint
      || !region
      || !bucket
      || !accessKeyId
      || !secretAccessKey
      || !publicBaseUrl
    ) {
      return undefined
    }

    return {
      accessKeyId,
      bucket,
      endpoint,
      publicBaseUrl: publicBaseUrl.replace(/\/$/, ''),
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
