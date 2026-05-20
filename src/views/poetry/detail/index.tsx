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
        <div className="my-18 sm:my-24 lg:my-28">
          <article className="font-mashanzheng min-w-0">
            <div className="max-w-none">
              <AppMarkdown content={post.content} />
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
