import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'

import components from './components'
import { remarkDirectiveComponents } from './remark-directive'

export interface AppMarkdownProps {
  content: string
}

export default function AppMarkdown({ content }: AppMarkdownProps) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveComponents]}
      rehypePlugins={[rehypeRaw]}
      components={components}
    >
      {content}
    </Markdown>
  )
}
