/// <reference types="vite/client" />

declare module '*.md' {
  const markdownModule: {
    content: string
    frontmatter: Record<string, unknown>
  }

  export default markdownModule
}

declare module '*.md?raw' {
  const content: string
  export default content
}
