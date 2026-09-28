export function normalizeMarkdownData(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  if (Array.isArray(value)) {
    return value.map(normalizeMarkdownData)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        normalizeMarkdownData(item),
      ]),
    )
  }

  return value
}
