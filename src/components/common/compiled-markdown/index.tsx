import type { ReactNode } from 'react'

import { createElement } from 'react'

export interface CompiledMarkdownElement {
  children: CompiledMarkdownNode[]
  properties: Record<string, boolean | number | string>
  tag: string
}

export type CompiledMarkdownNode = CompiledMarkdownElement | string

interface CompiledMarkdownProps {
  content: CompiledMarkdownNode[]
}

/**
 * Only accepts content processed by the markdown-matter plugin, used
 * for rendering Markdown files.
 * @returns ReactNodes that can be rendered by React.
 */
export default function CompiledMarkdown({ content }: CompiledMarkdownProps) {
  return content.map(renderNode)
}

function renderNode(
  node: CompiledMarkdownNode,
  key: number | string,
): ReactNode {
  if (typeof node === 'string') return node

  const properties = { ...node.properties, key }

  if (node.children.length === 0) {
    return createElement(node.tag, properties)
  }

  return createElement(
    node.tag,
    properties,
    node.children.map((child, index) => renderNode(child, index)),
  )
}
