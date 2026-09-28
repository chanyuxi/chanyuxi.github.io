import type { CompileMarkdownOptions, HastRoot } from './types'

import rehypeRaw from 'rehype-raw'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import { rehypePresentation } from './rehype-presentation'
import { remarkPoetryDirective } from './remark-poetry-directive'
import { serializeChildren } from './serialize'

export async function compileMarkdown(
  markdown: string,
  options: CompileMarkdownOptions,
) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkPoetryDirective)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePresentation, options)

  const tree = await processor.run(processor.parse(markdown.trim()))

  return serializeChildren(tree as HastRoot)
}
