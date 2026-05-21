import { motion, useReducedMotion } from 'motion/react'
import { Link, Navigate, useParams } from 'react-router'

import { getPoetryCatalog } from '../manifest'
import {
  createPoetryItemVariants,
  createPoetryPageVariants,
  poetryHoverTransition,
} from '../motion'

export default function PoetryCatalog() {
  const { catalog = '' } = useParams()
  const poetryCatalog = getPoetryCatalog(catalog)
  const shouldReduceMotion = useReducedMotion()
  const pageVariants = createPoetryPageVariants(shouldReduceMotion)
  const itemVariants = createPoetryItemVariants(shouldReduceMotion)

  if (!poetryCatalog) {
    return <Navigate to="/poetries/entrance" replace />
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="py-10 md:py-12 lg:py-16"
    >
      <div className="base-container max-w-4xl">
        <motion.header
          variants={itemVariants}
          className="my-8 border-b border-black/8 pb-8 text-center dark:border-white/10"
        >
          <p className="mb-3 text-[0.65rem] font-medium tracking-[0.42em] text-zinc-400 uppercase dark:text-zinc-500">
            {poetryCatalog.subtitle}
          </p>
          <h1 className="font-mashanzheng text-3xl tracking-wide sm:text-4xl">
            {poetryCatalog.title}
          </h1>
        </motion.header>

        {poetryCatalog.posts.length > 0 ? (
          <div className="flex flex-col">
            {poetryCatalog.posts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? undefined : { x: 6 }}
                transition={poetryHoverTransition}
              >
                <Link
                  to={post.routePath}
                  className="font-mashanzheng group block border-b border-black/8 py-5 sm:py-6 dark:border-white/10"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <div className="text-2xl font-medium transition-colors duration-500 group-hover:text-blue-600 dark:group-hover:text-blue-300">
                        {post.title}
                      </div>
                      {post.description ? (
                        <div className="mt-2 text-black/50 transition-colors duration-500 group-hover:text-black/70 dark:text-white/50 dark:group-hover:text-white/70">
                          {post.description}
                        </div>
                      ) : null}
                    </div>
                    <span className="font-bitter pt-1 text-xs text-black/25 uppercase dark:text-white/25">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="py-16 text-center text-sm text-zinc-500 dark:border-white/15 dark:text-zinc-400"
          >
            No poems yet.
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
