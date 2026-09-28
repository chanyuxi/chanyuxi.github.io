import type { CompileMarkdownOptions, HastElement, HastRoot } from './types'

import { visit } from 'unist-util-visit'

export function rehypePresentation(options: CompileMarkdownOptions) {
  return function transformer(tree: HastRoot) {
    visit(tree, 'element', (node) => {
      const element = node as unknown as HastElement

      if (element.tagName === 'md-poetry') {
        transformPoetryElement(element)
        return
      }

      if (options.changelog) {
        styleChangelogElement(element)
        return
      }

      styleHeading(element)
    })
  }
}

function styleChangelogElement(element: HastElement) {
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
  const classes = elementClasses[element.tagName]

  if (classes) {
    element.properties.className = classes
  }
}

function styleHeading(element: HastElement) {
  const headingClasses: Record<string, string[]> = {
    h1: ['my-4', 'text-3xl'],
    h2: ['my-4', 'text-2xl'],
    h3: ['my-4', 'text-2xl'],
    h4: ['my-4', 'text-xl'],
    h5: ['my-4', 'text-xl'],
    h6: ['my-4', 'text-lg'],
  }
  const classes = headingClasses[element.tagName]

  if (classes) {
    element.properties.className = classes
  }
}

function transformPoetryElement(element: HastElement) {
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
