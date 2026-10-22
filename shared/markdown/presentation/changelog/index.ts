import type { Element, Root } from 'hast'

import { visit } from 'unist-util-visit'

const elementClasses: Record<string, string[]> = {
  h1: [
    'mb-12',
    'text-4xl',
    'font-normal',
    'tracking-display',
    'sm:text-5xl',
  ],
  h2: [
    'mt-12',
    'border-b',
    'border-hairline',
    'pb-4',
    'text-xl',
    'font-medium',
    'tracking-tight',
    'first:mt-0',
    'sm:text-2xl',
    'dark:border-white/10',
  ],
  h3: [
    'mt-7',
    'text-xs',
    'font-medium',
    'tracking-label',
    'text-muted-soft',
    'uppercase',
    'dark:text-stone-500',
  ],
  li: ['leading-7', 'text-muted-foreground'],
  p: ['mt-4', 'leading-7', 'text-muted-foreground'],
  ul: ['mt-4', 'space-y-2'],
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

/** Changelog presentation: release-entry rhythm, safe links, lazy images. */
function rehypeChangelog() {
  return (tree: Root) => {
    visit(tree, 'element', (element) => {
      // TODO: 移除， Changelog 没有 a 和 img
      if (element.tagName === 'a') {
        openExternalLink(element)
        return
      }

      // TODO: 移除， Changelog 没有 a 和 img
      if (element.tagName === 'img') {
        lazyLoadImage(element)
        return
      }

      const classes = elementClasses[element.tagName]

      if (classes) {
        element.properties.className = classes
      }
    })
  }
}

export const changelogPresentation = {
  rehypePlugins: [rehypeChangelog],
  remarkPlugins: [],
}
