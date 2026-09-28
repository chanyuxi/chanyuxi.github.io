import type { DirectiveNode } from './types'
import type { Root } from 'mdast'

import { visit } from 'unist-util-visit'

export function remarkPoetryDirective() {
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

      if (directive.name !== 'poetry') return

      directive.data = {
        hName: 'md-poetry',
        hProperties: directive.attributes,
      }
    })
  }
}
