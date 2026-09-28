/// <reference types="vite/client" />

declare const __APP_VERSION__: string

declare module '*.md' {
  export const content: import('./components/common/compiled-markdown').CompiledMarkdownNode[]
  export const frontmatter: Record<string, unknown>

  const markdownModule: {
    content: import('./components/common/compiled-markdown').CompiledMarkdownNode[]
    frontmatter: Record<string, unknown>
  }

  export default markdownModule
}

declare module '*.md?raw' {
  const content: string
  export default content
}

declare module '*.md?content' {
  const content: import('./components/common/compiled-markdown').CompiledMarkdownNode[]
  export default content
}

declare module '*.md?frontmatter' {
  const frontmatter: Record<string, unknown>
  export default frontmatter
}
