import { Navigate, useParams } from 'react-router'

import AppMarkdown from '@/components/app-markdown'

import { getPoetryPost } from '../manifest'

export default function PoetryDetail() {
  const { category = '', slug = '' } = useParams()
  const post = getPoetryPost(category, slug)

  if (!post) {
    return <Navigate to="/poetry/entrance" replace />
  }

  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="base-container">
        <div className="">
          <article className="font-mashanzheng min-w-0">
            <div className="prose dark:prose-invert max-w-none">
              <AppMarkdown content={post.content} />
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

//
//
