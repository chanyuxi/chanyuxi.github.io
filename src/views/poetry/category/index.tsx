import { Link, Navigate, useParams } from 'react-router'

import { getPoetryCategory } from '../manifest'

export default function PoetryCategory() {
  const { category = '' } = useParams()
  const poetryCategory = getPoetryCategory(category)

  if (!poetryCategory) {
    return <Navigate to="/poetry/entrance" replace />
  }

  return (
    <section className="py-10 md:py-12 lg:py-16">
      <div className="base-container">
        <header className="my-8 pb-8 text-center dark:border-white/10">
          <h1 className="font-mashanzheng text-3xl tracking-wide sm:text-4xl">
            {poetryCategory.title}
          </h1>
        </header>

        {poetryCategory.posts.length > 0 ? (
          <div className="flex flex-col">
            {poetryCategory.posts.map(post => (
              <Link
                key={post.id}
                to={post.routePath}
                className="font-mashanzheng group p-4 sm:p-6"
              >
                <div className="text-2xl font-medium transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-300">
                  {post.title}
                </div>
                <div className="text-black/50 dark:text-white/50">
                  {post.description}
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
