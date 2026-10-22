import type { CompiledMarkdownNode } from '@shared/markdown/compile'

import CompiledMarkdown from '@/components/common/compiled-markdown'
import { cn } from '@/libs/utils'

interface PostContentProps {
  className?: string
  content: CompiledMarkdownNode[]
}

export function PostContent({ className, content }: PostContentProps) {
  return (
    <article
      className={cn(
        'prose max-w-none prose-stone dark:prose-invert prose-headings:font-serif prose-headings:font-light prose-pre:border prose-pre:border-hairline prose-pre:bg-transparent prose-pre:p-0',
        className,
      )}
    >
      <CompiledMarkdown content={content} />
    </article>
  )
}
