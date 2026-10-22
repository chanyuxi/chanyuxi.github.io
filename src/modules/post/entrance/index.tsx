import { MAX_POST_SEARCH_LENGTH } from '@shared/constants/posts'
import Search from '~icons/lucide/search'
import { useEffect, useState } from 'react'

import { InfiniteScrollTrigger } from '@/components/common/infinite-scroll-trigger'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePostsInfiniteQuery } from '@/services/posts/queries'

import { PostListItem } from '../components/post-list-item'
import { PostListSkeleton } from '../components/post-list-skeleton'

export default function PostEntrance() {
  // Decision record: the public feed stays ordered by publish date (the
  // server default). Ranking or recommendation work is out of scope until
  // the list outgrows pagination.
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const posts = usePostsInfiniteQuery(searchQuery)
  const items = posts.data?.pages.flatMap(page => page.items) ?? []

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(search.trim().toLowerCase())
    }, 300)

    return () => window.clearTimeout(timer)
  }, [search])

  return (
    <section className="min-h-page section-spacing">
      <div className="base-container">
        <div className="relative mb-8 max-w-xl">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-label="Search posts"
            autoComplete="off"
            className="pl-10"
            maxLength={MAX_POST_SEARCH_LENGTH}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search posts"
            type="search"
            value={search}
          />
        </div>

        <div>
          {posts.isPending
            ? (
                <PostListSkeleton />
              )
            : posts.isError && items.length === 0
              ? (
                  <div className="border-y border-hairline py-16 text-center">
                    <p className="text-sm text-muted-foreground">
                      The post list could not be loaded.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => posts.refetch()}
                      variant="outline"
                    >
                      Try again
                    </Button>
                  </div>
                )
              : items.length > 0
                ? (
                    <>
                      <div className="flex flex-col gap-4 sm:gap-5">
                        {items.map(post => (
                          <PostListItem key={post.id} post={post} />
                        ))}
                      </div>
                      <InfiniteScrollTrigger
                        errorMessage="Could not continue loading posts."
                        hasNextPage={Boolean(posts.hasNextPage)}
                        isError={posts.isFetchNextPageError}
                        isFetching={posts.isFetchingNextPage}
                        onLoadMore={() => {
                          void posts.fetchNextPage()
                        }}
                      />
                    </>
                  )
                : (
                    <div className="border-y border-hairline py-20 text-center">
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? 'No posts match your search.' : 'No posts yet.'}
                      </p>
                    </div>
                  )}
        </div>
      </div>
    </section>
  )
}
