import { InfiniteScrollTrigger } from '@/components/common/infinite-scroll-trigger'
import { Button } from '@/components/ui/button'
import { PostListItem } from '@/modules/post/components/post-list-item'
import { PostListSkeleton } from '@/modules/post/components/post-list-skeleton'
import { useMyPostsInfiniteQuery } from '@/services/posts/queries'

import { EmptyActivity } from './empty-activity'

export function PostsTabContent() {
  const posts = useMyPostsInfiniteQuery()
  const items = posts.data?.pages.flatMap(page => page.items) ?? []

  return (
    <div className="mt-6">
      {posts.isPending
        ? (
            <PostListSkeleton compact count={2} />
          )
        : posts.isError && items.length === 0
          ? (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Your posts could not be loaded.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => posts.refetch()}
                  size="sm"
                  variant="outline"
                >
                  Try again
                </Button>
              </div>
            )
          : items.length > 0
            ? (
                <>
                  <div className="flex flex-col gap-3">
                    {items.map(post => (
                      <PostListItem compact key={post.id} post={post} showStatus />
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
                <EmptyActivity tabId="posts" />
              )}
    </div>
  )
}
