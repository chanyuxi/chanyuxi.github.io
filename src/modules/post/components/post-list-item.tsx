import type { PostSummary } from '@shared/contracts/posts'

import ArrowUpRight from '~icons/lucide/arrow-up-right'
import { Link } from 'react-router'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/libs/utils'

import { formatPostDate, postAuthorName } from '../utils'

interface PostListItemProps {
  compact?: boolean
  post: PostSummary
  showStatus?: boolean
}

export function PostListItem({
  compact = false,
  post,
  showStatus = false,
}: PostListItemProps) {
  const isPublished = post.status === 'published'
  const href = isPublished ? `/post/${post.slug}` : `/post/editor/${post.id}`
  const visibleTags = post.tags.slice(0, 3)
  const remainingTags = post.tags.length - visibleTags.length

  return (
    <Link
      className={cn(
        'group block shadow-soft',
        compact
          ? 'rounded-xl border border-white/60 bg-card/70 p-4 backdrop-blur-xl dark:border-white/10'
          : 'rounded-2xl bg-card p-5 sm:p-6 dark:bg-dark-elevated',
      )}
      to={href}
    >
      <div className={cn('flex items-center justify-between', compact ? 'gap-4' : 'gap-5')}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
            <time dateTime={post.publishedAt ?? post.createdAt}>
              {formatPostDate(post.publishedAt ?? post.createdAt)}
            </time>
            {!compact
              ? (
                  <>
                    <span aria-hidden="true" className="size-1 rounded-full bg-hairline-strong" />
                    <span>{postAuthorName(post)}</span>
                  </>
                )
              : null}
            {showStatus
              ? (
                  <Tooltip>
                    <TooltipTrigger
                      aria-label={isPublished ? 'Published' : 'Draft'}
                      className="rounded-full p-1"
                      render={<span />}
                    >
                      <span
                        className={cn(
                          'block size-2.5 rounded-full',
                          isPublished ? 'bg-emerald-500' : 'bg-amber-400',
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent sideOffset={6}>
                      {isPublished ? 'Published' : 'Draft'}
                    </TooltipContent>
                  </Tooltip>
                )
              : null}
          </div>

          <h2
            className={cn(
              'mt-2 leading-tight font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-muted-foreground dark:text-stone-100 dark:group-hover:text-stone-300',
              compact ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl',
            )}
          >
            {post.title}
          </h2>

          {post.description
            ? (
                <p
                  className={cn(
                    'mt-2 max-w-2xl text-muted-foreground',
                    compact ? 'text-xs leading-5' : 'text-sm leading-6',
                  )}
                >
                  {post.description}
                </p>
              )
            : null}

          {visibleTags.length > 0
            ? (
                <div className={cn('flex flex-wrap items-center gap-2', compact ? 'mt-3' : 'mt-4')}>
                  {visibleTags.map(tag => (
                    <span
                      className={cn(
                        'rounded-full bg-muted font-medium tracking-label text-muted-foreground uppercase',
                        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
                      )}
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                  {remainingTags > 0
                    ? (
                        <span className={cn('text-muted-soft', compact ? 'text-[10px]' : 'text-[11px]')}>
                          {`+${remainingTags}`}
                        </span>
                      )
                    : null}
                </div>
              )
            : null}
        </div>

        <span
          className={cn(
            'hidden shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors duration-300 group-hover:bg-secondary group-hover:text-ink sm:flex dark:group-hover:text-stone-100',
            compact ? 'size-8' : 'size-9',
          )}
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  )
}
