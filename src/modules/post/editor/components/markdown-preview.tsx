import type { CompiledMarkdownNode } from '@shared/markdown/compile'

import { compileMarkdown } from '@shared/markdown/compile'
import { useEffect, useState } from 'react'

import { Alert } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

import { PostContent } from '../../components/post-content'

interface MarkdownPreviewProps {
  active: boolean
  contentMd: string
}

export function MarkdownPreview({ active, contentMd }: MarkdownPreviewProps) {
  const [compiledSource, setCompiledSource] = useState<null | string>(null)
  const [content, setContent] = useState<CompiledMarkdownNode[]>([])
  const [error, setError] = useState<null | string>(null)
  const [isCompiling, setIsCompiling] = useState(false)

  // Derived during render: an empty source renders the empty branch without
  // touching state, so the effect below only ever schedules async work.
  const isEmpty = !contentMd.trim()

  useEffect(() => {
    if (!active || isEmpty || contentMd === compiledSource) return

    let current = true

    // Adaptive debounce: long documents wait longer between compiles so
    // typing stays smooth while the pipeline catches up.
    const delay = Math.max(180, Math.min(600, Math.round(contentMd.length / 200)))

    const timer = window.setTimeout(() => {
      setIsCompiling(true)

      compileMarkdown(contentMd, {
        mode: 'post',
        sanitize: true,
      })
        .then((nodes) => {
          if (!current) return

          setContent(nodes)
          setCompiledSource(contentMd)
          setError(null)
        })
        .catch((reason: unknown) => {
          if (!current) return

          setError(
            reason instanceof Error
              ? reason.message
              : 'Unable to render the preview',
          )
        })
        .finally(() => {
          if (current) setIsCompiling(false)
        })
    }, delay)

    return () => {
      current = false
      window.clearTimeout(timer)
    }
  }, [active, compiledSource, contentMd, isEmpty])

  if (isEmpty) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
        Nothing to preview yet.
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="m-6">
        {error}
      </Alert>
    )
  }

  const showSkeleton = isCompiling && content.length === 0

  return (
    <div className="relative min-h-full">
      {isCompiling && content.length > 0
        ? (
            // Slim progress hint while an already rendered preview recompiles.
            <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden">
              <div className="size-full bg-hairline-strong motion-safe:animate-pulse" />
            </div>
          )
        : null}
      {showSkeleton
        ? (
            <div className="space-y-4 py-8">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          )
        : (
            <PostContent content={content} />
          )}
    </div>
  )
}
