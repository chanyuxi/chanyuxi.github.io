import type { Content, Element, Root } from 'hast'
import type { PluggableList } from 'unified'

import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import { changelogPresentation } from './presentation/changelog/index.js'
import { poetryPresentation } from './presentation/poetry/index.js'
import { postPresentation } from './presentation/post/index.js'

/** A serialized element the renderer turns back into DOM nodes. */
export interface CompiledMarkdownElement {
  children: CompiledMarkdownNode[]
  properties: Record<string, boolean | number | string>
  tag: string
}

export type CompiledMarkdownNode = CompiledMarkdownElement | string

export interface CompileMarkdownOptions {
  /** Required: selects the presentation pass applied to the compiled output. */
  mode: MarkdownMode
  /** Whether the tree must be sanitized for untrusted (database-backed) authors. */
  sanitize?: boolean
}

/** Content kind; each mode owns a presentation in `presentation/<mode>`. */
export type MarkdownMode = 'changelog' | 'poetry' | 'post'

/** Pipeline extensions a presentation mode contributes to `compileMarkdown`. */
export interface MarkdownPresentation {
  /** rehype plugins running after raw-HTML parsing and sanitization. */
  rehypePlugins: PluggableList
  /** remark plugins running between GFM and the mdast-to-hast conversion. */
  remarkPlugins: PluggableList
  /** Replaces the GitHub-default schema when sanitizing untrusted input. */
  sanitizeSchema?: typeof defaultSchema
}

/**
 * Bump whenever the compiled node shape changes, so database-backed posts
 * know their cached `content_json` must be rebuilt.
 */
export const MARKDOWN_COMPILER_VERSION = 2

const presentations: Record<MarkdownMode, MarkdownPresentation> = {
  changelog: changelogPresentation,
  poetry: poetryPresentation,
  post: postPresentation,
}

/** Compiles Markdown into the serialized node tree the renderer consumes. */
export async function compileMarkdown(
  markdown: string,
  options: CompileMarkdownOptions,
) {
  const { mode, sanitize = false } = options
  const presentation = presentations[mode]

  // Raw HTML is parsed first, then stripped down for untrusted input; the
  // presentation pass afterwards only adds attributes we generated ourselves.
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(presentation.remarkPlugins)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)

  if (sanitize) {
    processor.use(rehypeSanitize, presentation.sanitizeSchema ?? defaultSchema)
  }

  processor.use(presentation.rehypePlugins)

  const tree = await processor.run(processor.parse(markdown)) as Root

  return serializeChildren(tree)
}

function serializeChildren(root: Root) {
  return root.children.flatMap(serializeNode)
}

function serializeNode(node: Content): CompiledMarkdownNode[] {
  if (node.type === 'text') {
    return [node.value]
  }

  if (node.type !== 'element') return []

  return [{
    children: node.children.flatMap(serializeNode),
    properties: serializeProperties(node.properties),
    tag: node.tagName,
  }]
}

/** hast exposes class lists as arrays; join them into the strings the renderer consumes. */
function serializeProperties(properties: Element['properties']) {
  return Object.fromEntries(
    Object.entries(properties).flatMap(([key, value]) => {
      if (value === null || value === undefined) return []

      return [[key, Array.isArray(value) ? value.join(' ') : value]]
    }),
  ) as CompiledMarkdownElement['properties']
}
