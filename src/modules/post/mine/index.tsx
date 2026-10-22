import Plus from '~icons/lucide/plus'
import { Link } from 'react-router'

import { InfiniteScrollTrigger } from '@/components/common/infinite-scroll-trigger'
import { Button } from '@/components/ui/button'
import { useMyPostsInfiniteQuery } from '@/services/posts/queries'

import { PostListItem } from '../components/post-list-item'
import { PostListSkeleton } from '../components/post-list-skeleton'

export default function MyPosts() {
  const posts = useMyPostsInfiniteQuery()
  const items = posts.data?.pages.flatMap(page => page.items) ?? []

  return (
    <section className="min-h-page section-spacing">
      <div className="base-container">
        <header className="flex items-end justify-between gap-7 border-b border-hairline pb-8">
          <h1 className="display-heading">My posts</h1>
          <Button render={<Link to="/post/editor" />}>
            <Plus className="size-4" />
            Write a post
          </Button>
        </header>

        <div className="mt-2">
          {posts.isPending
            ? (
                <PostListSkeleton count={2} />
              )
            : posts.isError && items.length === 0
              ? (
                  <div className="py-16 text-center">
                    <p className="text-sm text-muted-foreground">
                      Your posts could not be loaded.
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
                          <PostListItem key={post.id} post={post} showStatus />
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
                    <div className="py-20 text-center">
                      <p className="font-serif text-2xl tracking-tight text-ink dark:text-stone-100">
                        Nothing here yet.
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Start a draft and it will appear here.
                      </p>
                    </div>
                  )}
        </div>
      </div>
    </section>
  )
}
