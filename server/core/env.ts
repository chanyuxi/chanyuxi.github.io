/** Read an optional environment variable, treating blank values as unset. */
export function optionalEnv(name: string): string | undefined {
  return process.env[name]?.trim() || undefined
}

/** Read a required environment variable, or fail fast with a clear error. */
export function requireEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is not configured`)
  }

  return value
}
