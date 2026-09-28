export interface CompiledMarkdownElement {
  children: CompiledMarkdownNode[]
  properties: Record<string, unknown>
  tag: string
}

export type CompiledMarkdownNode = CompiledMarkdownElement | string

export interface CompileMarkdownOptions {
  changelog: boolean
}

export interface DirectiveNode {
  attributes?: Record<string, string>
  children?: unknown[]
  data?: {
    hName?: string
    hProperties?: Record<string, string>
  }
  name: string
  type: 'containerDirective' | 'leafDirective' | 'textDirective'
}

export interface HastElement {
  children: HastNode[]
  properties: Record<string, unknown>
  tagName: string
  type: 'element'
}

export type HastNode = { type: string } | HastElement | HastRoot | HastText

export interface HastRoot {
  children: HastNode[]
  type: 'root'
}

export interface HastText {
  type: 'text'
  value: string
}
