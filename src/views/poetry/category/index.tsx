import { Link, Navigate, useParams } from 'react-router'

import { getPoetryCategory } from '../manifest'

export default function PoetryCategory() {
  const { category = '' } = useParams()
  const poetryCategory = getPoetryCategory(category)

  if (!poetryCategory) {
    return <Navigate to="/poetry/entrance" replace />
  }

  return (
    // TODO: share "py-8 sm:py-10 md:py-12 lg:py-16" to an utility class
    <section className="py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="base-container">
        <header className="my-8 border-b border-black/10 pb-8 text-center dark:border-white/10">
          <h1 className="font-mashanzheng text-4xl tracking-wide sm:text-5xl">
            {poetryCategory.title}
          </h1>
          <p className="mt-3 text-sm tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            {poetryCategory.subtitle}
          </p>
        </header>

        {poetryCategory.posts.length > 0 ? (
          <div className="flex flex-col">
            {poetryCategory.posts.map(post => (
              <Link
                key={post.id}
                to={post.routePath}
                className="group flex items-center justify-between p-5 transition-colors hover:border-blue-500/50 hover:bg-blue-500/10 dark:border-white/10"
              >
                <div className="font-mashanzheng text-2xl font-medium transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-300">
                  {post.title}
                </div>
                <div className="font-mashanzheng text-xl text-black/50 dark:text-white/50">
                  随缘
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-zinc-500 dark:border-white/15 dark:text-zinc-400">
            No poems yet.
          </div>
        )}
      </div>
    </section>
  )
}
