/// <reference types="vite/client" />

declare module '*.md' {
  const markdownModule: {
    frontmatter: Record<string, unknown>
    content: string
  }

  export default markdownModule
}

declare module '*.md?raw' {
  const content: string
  export default content
}
