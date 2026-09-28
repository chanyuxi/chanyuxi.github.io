import './index.css'

import type { LoaderFunctionArgs } from 'react-router'

import { motion, useReducedMotion } from 'motion/react'
import { redirect, useLoaderData } from 'react-router'

import CompiledMarkdown from '@/components/common/compiled-markdown'

import { getPoetryPost } from '../manifest'
import { createPoetryItemVariants, createPoetryPageVariants } from '../motion'

export async function loader({ params }: LoaderFunctionArgs) {
  const post = getPoetryPost(params.catalog ?? '', params.slug ?? '')

  if (!post) {
    throw redirect('/poetries/entrance')
  }

  return { content: await post.loadContent() }
}

export default function PoetryDetail() {
  const { content } = useLoaderData<typeof loader>()
  const shouldReduceMotion = useReducedMotion()

  const pageVariants = createPoetryPageVariants(shouldReduceMotion)
  const itemVariants = createPoetryItemVariants(shouldReduceMotion)

  return (
    <motion.section
      animate="visible"
      className="py-8 sm:py-10 md:py-12 lg:py-16"
      initial="hidden"
      variants={pageVariants}
    >
      <div className="base-container">
        <motion.div className="my-18 sm:my-24 lg:my-28" variants={itemVariants}>
          <article className="font-mashanzheng min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 dark:border-white/10">
            <div className="max-w-none">
              <CompiledMarkdown content={content} />
            </div>
          </article>
        </motion.div>
      </div>
    </motion.section>
  )
}
