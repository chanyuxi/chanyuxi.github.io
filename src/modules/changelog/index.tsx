import type { Components } from 'react-markdown'

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import changelog from '../../../CHANGELOG.md?raw'

const components = {
  h1: ({ children }) => (
    <h1 className="mb-12 text-4xl font-normal tracking-display sm:text-5xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-12 border-b border-hairline pb-4 text-xl font-medium tracking-tight first:mt-0 sm:text-2xl dark:border-white/10">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-7 text-xs font-medium tracking-label text-muted-soft uppercase dark:text-stone-500">
      {children}
    </h3>
  ),
  li: ({ children }) => (
    <li className="leading-7 text-muted-foreground">{children}</li>
  ),
  p: ({ children }) => (
    <p className="mt-4 leading-7 text-muted-foreground">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 space-y-2">{children}</ul>
  ),
} satisfies Components

export default function Changelog() {
  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <article className="base-container">
        <div className="max-w-3xl">
          <Markdown components={components} remarkPlugins={[remarkGfm]}>
            {changelog}
          </Markdown>
        </div>
      </article>
    </section>
  )
}
