import { motion, useReducedMotion } from 'motion/react'
import { Navigate, useParams } from 'react-router'

import AppMarkdown from '@/components/app-markdown'

import { getPoetryPost } from '../manifest'
import { createPoetryItemVariants, createPoetryPageVariants } from '../motion'

export default function PoetryDetail() {
  const { catalog = '', slug = '' } = useParams()
  const post = getPoetryPost(catalog, slug)
  const shouldReduceMotion = useReducedMotion()

  const pageVariants = createPoetryPageVariants(shouldReduceMotion)
  const itemVariants = createPoetryItemVariants(shouldReduceMotion)

  if (!post) {
    return <Navigate to="/poetry/entrance" replace />
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="py-8 sm:py-10 md:py-12 lg:py-16"
    >
      <div className="base-container">
        <motion.div variants={itemVariants} className="my-18 sm:my-24 lg:my-28">
          <article className="font-mashanzheng min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 dark:border-white/10">
            <div className="max-w-none">
              <AppMarkdown content={post.content} />
            </div>
          </article>
        </motion.div>
      </div>
    </motion.section>
  )
}
