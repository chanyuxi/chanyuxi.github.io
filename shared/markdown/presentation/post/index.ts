import type { Element, Root } from 'hast'
import type { Root as MdastRoot } from 'mdast'

import rehypeHighlight from 'rehype-highlight'
import { defaultSchema } from 'rehype-sanitize'
import remarkDirective from 'remark-directive'
import { visit } from 'unist-util-visit'

/**
 * Narrowed shape of a `:::poetry` directive node; remark-directive extends
 * mdast beyond its published types.
 */
interface PoetryDirectiveNode {
  attributes?: Record<string, string | undefined>
  data?: {
    hName?: string
    hProperties?: Record<string, string | undefined>
  }
  name: string
  type: 'containerDirective'
}

const headingClasses: Record<string, string[]> = {
  h1: ['my-4', 'text-3xl'],
  h2: ['my-4', 'text-2xl'],
  h3: ['my-4', 'text-2xl'],
  h4: ['my-4', 'text-xl'],
  h5: ['my-4', 'text-xl'],
  h6: ['my-4', 'text-lg'],
}

/** Expands an `md-poetry` element into the centered calligraphy block. */
function expandPoetryElement(element: Element) {
  const title = typeof element.properties.title === 'string'
    ? element.properties.title
    : ''
  const type = element.properties.type === 'lyric' ? 'lyric' : 'poetry'
  const bodyClasses = [
    'flex',
    'flex-col',
    'gap-2',
    'text-xl',
    'sm:gap-4',
    'sm:text-2xl',
    type === 'lyric'
      ? 'text-left [&>p]:indent-10 sm:[&>p]:indent-12'
      : 'text-center',
  ]

  element.tagName = 'div'
  element.properties = {
    className: [
      'mx-auto',
      'flex',
      'max-w-2xl',
      'flex-col',
      'items-center',
      'text-center',
      'select-none',
    ],
  }
  element.children = [
    {
      children: [{ type: 'text', value: title }],
      properties: {
        className: ['mb-8', 'text-2xl', 'sm:mb-10', 'sm:text-3xl'],
      },
      tagName: 'div',
      type: 'element',
    },
    {
      children: element.children,
      properties: { className: bodyClasses },
      tagName: 'div',
      type: 'element',
    },
  ]
}

/** Loads images lazily so long documents stay cheap to render. */
function lazyLoadImage(element: Element) {
  element.properties.decoding = 'async'
  element.properties.loading = 'lazy'
}

/** Opens external links safely in a new tab. */
function openExternalLink(element: Element) {
  const href = typeof element.properties.href === 'string'
    ? element.properties.href
    : ''

  if (/^https?:\/\//i.test(href)) {
    element.properties.target = '_blank'
    element.properties.rel = ['noreferrer']
  }
}

/**
 * Post presentation: highlighted code, calligraphy blocks, heading rhythm,
 * safe links, lazy images.
 */
function rehypePost() {
  return (tree: Root) => {
    visit(tree, 'element', (element) => {
      if (element.tagName === 'md-poetry') {
        expandPoetryElement(element)
        return
      }

      if (element.tagName === 'a') {
        openExternalLink(element)
        return
      }

      if (element.tagName === 'img') {
        lazyLoadImage(element)
        return
      }

      const classes = headingClasses[element.tagName]

      if (classes) {
        element.properties.className = classes
      }
    })
  }
}

/** Rewrites `:::poetry` containers into `md-poetry` elements for the rehype pass. */
function remarkPoetryDirective() {
  return (tree: MdastRoot) => {
    visit(tree, (node) => {
      const directive = node as unknown as PoetryDirectiveNode

      if (directive.type !== 'containerDirective') return

      if (directive.name !== 'poetry') return

      directive.data = { hName: 'md-poetry', hProperties: directive.attributes }
    })
  }
}

/**
 * Schema for untrusted (database-backed) posts: the GitHub default plus the
 * `md-poetry` tags and attributes our remark pass generates, so raw HTML
 * cannot smuggle executable content into the renderer.
 */
const postSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    'md-poetry': ['title', 'type'],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto'],
    src: ['http', 'https'],
  },
  tagNames: [...(defaultSchema.tagNames ?? []), 'md-poetry'],
}

export const postPresentation = {
  rehypePlugins: [rehypeHighlight, rehypePost],
  remarkPlugins: [remarkDirective, remarkPoetryDirective],
  sanitizeSchema: postSanitizeSchema,
}
