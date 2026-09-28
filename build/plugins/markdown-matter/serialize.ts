import type {
  CompiledMarkdownNode,
  HastElement,
  HastNode,
  HastRoot,
  HastText,
} from './types'

export function serializeChildren(root: HastRoot) {
  return root.children.flatMap(serializeNode)
}

function normalizeProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(properties).flatMap(([key, value]) => {
      if (value === null || value === undefined) return []

      return [[key, Array.isArray(value) ? value.join(' ') : value]]
    }),
  )
}

function serializeNode(node: HastNode): CompiledMarkdownNode[] {
  if (node.type === 'text') {
    return [(node as HastText).value]
  }

  if (node.type !== 'element') return []

  const element = node as HastElement

  return [{
    children: element.children.flatMap(serializeNode),
    properties: normalizeProperties(element.properties),
    tag: element.tagName,
  }]
}
