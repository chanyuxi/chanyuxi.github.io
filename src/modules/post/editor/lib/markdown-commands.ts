import type { EditorView } from '@codemirror/view'

/**
 * Toolbar commands for the post editor. Each command takes the current
 * selection and dispatches one focused document transaction.
 */
export type MarkdownCommand
  = | 'bold'
    | 'bullet-list'
    | 'code'
    | 'heading'
    | 'image'
    | 'italic'
    | 'link'
    | 'ordered-list'
    | 'quote'

/** Runs a toolbar command against the editor's current selection. */
export function runMarkdownCommand(
  view: EditorView,
  command: MarkdownCommand,
) {
  switch (command) {
    case 'bold':
      wrapSelection(view, '**', '**', 'bold text')
      break
    case 'bullet-list':
      prefixLines(view, () => '- ')
      break
    case 'code':
      toggleCode(view)
      break
    case 'heading':
      prefixLines(view, () => '## ')
      break
    case 'image':
      insertLink(view, true)
      break
    case 'italic':
      wrapSelection(view, '_', '_', 'italic text')
      break
    case 'link':
      insertLink(view, false)
      break
    case 'ordered-list':
      prefixLines(view, index => `${index + 1}. `)
      break
    case 'quote':
      prefixLines(view, () => '> ')
      break
  }
}

/**
 * Wraps the selection in a Markdown link or image, selecting the
 * placeholder URL so typing replaces it immediately.
 */
function insertLink(view: EditorView, image: boolean) {
  const { from, to } = view.state.selection.main
  const selected = view.state.sliceDoc(from, to) || (image ? 'alt text' : 'link text')
  const prefix = image ? '![' : '['
  const insert = `${prefix}${selected}](https://)`
  const urlStart = from + prefix.length + selected.length + 2

  view.dispatch({
    changes: { from, insert, to },
    selection: {
      anchor: urlStart,
      head: urlStart + 'https://'.length,
    },
  })
  view.focus()
}

/**
 * Prefixes every selected line (block commands: lists, headings, quotes).
 * The prefix callback receives the line index within the selection.
 */
function prefixLines(
  view: EditorView,
  prefix: (index: number) => string,
) {
  const { from, to } = view.state.selection.main
  const startLine = view.state.doc.lineAt(from)
  const endLine = view.state.doc.lineAt(to)
  const changes = []

  for (let number = startLine.number; number <= endLine.number; number += 1) {
    const line = view.state.doc.line(number)

    changes.push({
      from: line.from,
      insert: prefix(number - startLine.number),
    })
  }

  view.dispatch({ changes })
  view.focus()
}

/**
 * Toggles inline code for a single-line selection and a fenced block for
 * multiline selections; the code body stays selected in both cases.
 */
function toggleCode(view: EditorView) {
  const { from, to } = view.state.selection.main
  const selected = view.state.sliceDoc(from, to)

  if (selected.includes('\n')) {
    const insert = `\`\`\`\n${selected}\n\`\`\``

    view.dispatch({
      changes: { from, insert, to },
      selection: {
        anchor: from + 4,
        head: from + 4 + selected.length,
      },
    })
  }
  else {
    wrapSelection(view, '`', '`', 'code')
  }

  view.focus()
}

/**
 * Wraps the selection (or a placeholder) in the given markers and keeps the
 * wrapped text selected.
 */
function wrapSelection(
  view: EditorView,
  before: string,
  after: string,
  placeholder: string,
) {
  const { from, to } = view.state.selection.main
  const selected = view.state.sliceDoc(from, to) || placeholder
  const insert = `${before}${selected}${after}`

  view.dispatch({
    changes: { from, insert, to },
    selection: {
      anchor: from + before.length,
      head: from + before.length + selected.length,
    },
  })
  view.focus()
}
