import type { MarkdownCommand } from '../lib/markdown-commands'

import Bold from '~icons/lucide/bold'
import Code2 from '~icons/lucide/code-2'
import Heading2 from '~icons/lucide/heading-2'
import ImageIcon from '~icons/lucide/image'
import Italic from '~icons/lucide/italic'
import Link2 from '~icons/lucide/link-2'
import List from '~icons/lucide/list'
import ListOrdered from '~icons/lucide/list-ordered'
import Quote from '~icons/lucide/quote'

import { Button } from '@/components/ui/button'

interface EditorToolbarProps {
  disabled?: boolean
  onCommand: (command: MarkdownCommand) => void
}

const tools = [
  { command: 'bold', icon: Bold, label: 'Bold' },
  { command: 'italic', icon: Italic, label: 'Italic' },
  { command: 'heading', icon: Heading2, label: 'Heading' },
  { command: 'quote', icon: Quote, label: 'Quote' },
  { command: 'bullet-list', icon: List, label: 'Bullet list' },
  { command: 'ordered-list', icon: ListOrdered, label: 'Numbered list' },
  { command: 'code', icon: Code2, label: 'Code' },
  { command: 'link', icon: Link2, label: 'Link' },
  { command: 'image', icon: ImageIcon, label: 'Image' },
] as const satisfies Array<{
  command: MarkdownCommand
  icon: typeof Bold
  label: string
}>

export function EditorToolbar({ disabled, onCommand }: EditorToolbarProps) {
  return (
    <div
      aria-label="Markdown formatting"
      className="flex flex-wrap items-center gap-1 border-b border-hairline bg-muted/40 px-2 py-1.5"
      role="toolbar"
    >
      {tools.map(({ command, icon: Icon, label }) => (
        <Button
          aria-label={label}
          disabled={disabled}
          key={command}
          onClick={() => onCommand(command)}
          shape="compact"
          size="icon-sm"
          title={label}
          type="button"
          variant="ghost"
        >
          <Icon className="size-4" />
        </Button>
      ))}
    </div>
  )
}
