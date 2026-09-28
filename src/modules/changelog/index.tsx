import CompiledMarkdown from '@/components/common/compiled-markdown'

import { content as changelog } from '../../../CHANGELOG.md'

export default function Changelog() {
  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <article className="base-container">
        <div className="max-w-3xl">
          <CompiledMarkdown content={changelog} />
        </div>
      </article>
    </section>
  )
}
