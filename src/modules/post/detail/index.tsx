import { PostErrorCode } from '@shared/contracts/posts'
import ArrowLeft from '~icons/lucide/arrow-left'
import PenLine from '~icons/lucide/pen-line'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router'

import { ApiError } from '@/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth'
import { useMeQuery } from '@/services/auth/queries'
import { usePostQuery } from '@/services/posts/queries'

import { PostContent } from '../components/post-content'
import { formatPostDate, postAuthorName } from '../utils'

export default function PostDetail() {
  const { slug = '' } = useParams<{ slug: string }>()
  const postQuery = usePostQuery(slug)
  const { status, user } = useAuth()
  // TODO: 建议封装位 useMe 并提供 isOwner、isAdmin
  const me = useMeQuery({ enabled: status === 'authenticated' })
  const post = postQuery.data

  // Synchronize document information
  useEffect(() => {
    if (!post) return

    document.title = `${post.title} | CHANYUXI`
    document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.setAttribute('content', post.description ?? post.title)
  }, [post])

  if (postQuery.isPending) {
    return <PostDetailLoading />
  }

  if (postQuery.isError || !post) {
    const isMissing = postQuery.error instanceof ApiError
      && postQuery.error.code === PostErrorCode.NotFound

    return (
      <section className="min-h-page section-spacing">
        <div className="base-container text-center">
          <p className="section-eyebrow">Writing</p>
          <h1 className="display-heading mt-4">
            {isMissing ? 'This post is not here.' : 'This post could not be loaded.'}
          </h1>
          <p className="section-body mt-4">
            {isMissing
              ? 'The link may be broken, or the post may have been unpublished.'
              : 'Check your connection and try again.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button render={<Link to="/post" />} variant="outline">
              <ArrowLeft className="size-4" />
              All posts
            </Button>
            {!isMissing
              ? <Button onClick={() => postQuery.refetch()}>Try again</Button>
              : null}
          </div>
        </div>
      </section>
    )
  }

  const canEdit = status === 'authenticated'
    && (user?.id === post.author.id
      || me.data?.profile.role === 'admin'
      || me.data?.profile.role === 'owner')
  const authorName = postAuthorName(post)
  const initial = authorName.slice(0, 1).toUpperCase()

  return (
    <section className="min-h-page section-spacing">
      <div className="base-container">
        <header className="border-b border-hairline pb-10">
          <div className="flex items-start justify-between gap-4 sm:gap-6">
            <div className="min-w-0 flex-1">
              {post.tags.length > 0
                ? (
                    <div className="mb-5 flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span
                          className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium tracking-label text-muted-foreground uppercase"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )
                : null}

              <h1 className="font-serif text-4xl leading-tight font-light tracking-display text-balance text-ink sm:text-5xl dark:text-stone-50">
                {post.title}
              </h1>
            </div>

            <div
              aria-label="Post actions"
              className="flex shrink-0 items-center gap-1"
              role="toolbar"
            >
              <Button
                aria-label="Back to all posts"
                render={<Link to="/post" />}
                size="icon"
                title="Back to all posts"
                variant="outline"
              >
                <ArrowLeft className="size-4" />
              </Button>

              {canEdit
                ? (
                    <Button
                      aria-label="Edit post"
                      render={<Link to={`/post/editor/${post.id}`} />}
                      size="icon"
                      title="Edit post"
                      variant="outline"
                    >
                      <PenLine className="size-4" />
                    </Button>
                  )
                : null}
            </div>
          </div>

          {post.description
            ? (
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                  {post.description}
                </p>
              )
            : null}

          <div className="mt-7 flex items-center gap-3">
            <Avatar size="sm">
              {post.author.avatarUrl
                ? <AvatarImage alt="" src={post.author.avatarUrl} />
                : null}
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-ink dark:text-stone-100">
                {authorName}
              </p>
              <p className="mt-0.5">
                <time dateTime={post.publishedAt ?? post.createdAt}>
                  {formatPostDate(post.publishedAt ?? post.createdAt)}
                </time>
              </p>
            </div>
          </div>
        </header>

        <PostContent
          className="mt-10 sm:mt-12"
          content={post.content}
        />
      </div>
    </section>
  )
}

function PostDetailLoading() {
  return (
    <section className="min-h-page section-spacing">
      <div className="base-container">
        <div className="border-b border-hairline pb-10">
          <div className="flex items-start justify-between gap-4 sm:gap-6">
            <Skeleton className="h-12 w-3/5" />
            <div className="flex shrink-0 gap-1">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="size-10 rounded-full" />
            </div>
          </div>
          <Skeleton className="mt-5 h-4 w-full max-w-2xl" />
          <Skeleton className="mt-2 h-4 w-3/4 max-w-xl" />
          <Skeleton className="mt-8 h-8 w-48" />
        </div>
        <div className="mt-10 max-w-3xl space-y-4 sm:mt-12">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </section>
  )
}
