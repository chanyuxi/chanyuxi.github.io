import CompiledMarkdown from '@/components/common/compiled-markdown'

import { content as changelog } from '../../../CHANGELOG.md'

export default function Changelog() {
  return (
    <section className="section-spacing">
      <article className="base-container">
        <CompiledMarkdown content={changelog} />
      </article>
    </section>
  )
}
