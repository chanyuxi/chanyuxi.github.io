import type { Root } from 'mdast'

import { visit } from 'unist-util-visit'

import { directiveTagMap } from './components'

type DirectiveNode = {
  attributes?: Record<string, unknown>
  children?: Array<ParagraphNode | PhrasingNode>
  data?: {
    hName?: string
    hProperties?: Record<string, unknown>
  }
  name: string
  type: 'containerDirective' | 'leafDirective' | 'textDirective'
}

type ParagraphNode = {
  children?: PhrasingNode[]
  data?: {
    directiveLabel?: boolean | null
  }
  type: 'paragraph'
}

type PhrasingNode = {
  children?: PhrasingNode[]
  data?: {
    directiveLabel?: boolean | null
  }
  type: string
  value?: string
}

export function remarkDirectiveComponents() {
  return function transformer(tree: Root) {
    visit(tree, function (node) {
      const directive = node as unknown as DirectiveNode

      if (
        directive.type !== 'containerDirective'
        && directive.type !== 'leafDirective'
        && directive.type !== 'textDirective'
      ) {
        return
      }

      const tagName = directiveTagMap[directive.name]

      if (!tagName) {
        return
      }

      const label = getDirectiveLabel(directive)
      const properties = {
        ...(directive.attributes ?? {}),
        ...(label ? { label } : {}),
      }

      directive.data = {
        hName: tagName,
        hProperties: properties,
      }

      if (
        directive.type === 'containerDirective'
        && isDirectiveLabelParagraph(directive.children?.[0])
      ) {
        directive.children = directive.children?.slice(1)
      }
    })
  }
}

function getDirectiveLabel(directive: DirectiveNode): string | undefined {
  if (directive.type === 'containerDirective') {
    const firstChild = directive.children?.[0]

    if (!isDirectiveLabelParagraph(firstChild)) {
      return
    }

    return getNodeText(firstChild)
  }

  return directive.children?.map(child => getNodeText(child)).join('')
}

function getNodeText(node: ParagraphNode | PhrasingNode): string {
  if ('value' in node && node.value) {
    return node.value
  }

  return node.children?.map(child => getNodeText(child)).join('') ?? ''
}

function isDirectiveLabelParagraph(
  node: ParagraphNode | PhrasingNode | undefined,
): node is ParagraphNode {
  return node?.type === 'paragraph' && node.data?.directiveLabel === true
}
