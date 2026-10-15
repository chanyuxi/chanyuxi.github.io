import { useEffect } from 'react'
import { useMatches } from 'react-router'

export interface PageMetadata {
  description: string
  title: string
}

export function RouteMetadata() {
  const matches = useMatches()
  let metadata: PageMetadata | undefined

  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const handle = matches[index].handle

    if (isPageMetadata(handle)) {
      metadata = handle
      break
    }
  }

  useEffect(() => {
    if (!metadata) return

    document.title = metadata.title
    document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.setAttribute('content', metadata.description)
  }, [metadata])

  return null
}

function isPageMetadata(value: unknown): value is PageMetadata {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<PageMetadata>

  return typeof candidate.description === 'string'
    && typeof candidate.title === 'string'
}
