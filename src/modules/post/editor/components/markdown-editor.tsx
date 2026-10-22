import type { Extension } from '@codemirror/state'

import { markdown } from '@codemirror/lang-markdown'
import { Annotation, Compartment, EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, placeholder } from '@codemirror/view'
import { MAX_POST_CONTENT_LENGTH } from '@shared/constants/posts'
import { basicSetup } from 'codemirror'
import { useEffect, useRef } from 'react'

import { useTheme } from '@/contexts/theme'

const ExternalChange = Annotation.define<boolean>()

interface MarkdownEditorProps {
  onChange: (value: string) => void
  onReady?: (view: EditorView | null) => void
  value: string
}

export function MarkdownEditor({ onChange, onReady, value }: MarkdownEditorProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)
  const onReadyRef = useRef(onReady)
  const initialThemeRef = useRef(isDark)
  const initialValueRef = useRef(value)
  const themeCompartment = useRef(new Compartment()).current

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    if (!containerRef.current) return

    const view = new EditorView({
      parent: containerRef.current,
      state: EditorState.create({
        doc: initialValueRef.current,
        extensions: [
          basicSetup,
          markdown(),
          EditorView.lineWrapping,
          // Mirrors the server-side content cap: typing stops at the limit
          // instead of a save failing with a generic validation error.
          EditorState.changeFilter.of(transaction =>
            transaction.newDoc.length <= MAX_POST_CONTENT_LENGTH,
          ),
          EditorView.contentAttributes.of({
            'aria-label': 'Markdown editor',
            'spellcheck': 'false',
          }),
          placeholder('Write your post in Markdown…'),
          themeCompartment.of(editorTheme(initialThemeRef.current)),
          EditorView.updateListener.of((update) => {
            if (
              update.docChanged
              && !update.transactions.some(transaction =>
                transaction.annotation(ExternalChange),
              )
            ) {
              onChangeRef.current(update.state.doc.toString())
            }
          }),
        ],
      }),
    })

    viewRef.current = view
    onReadyRef.current?.(view)

    return () => {
      onReadyRef.current?.(null)
      view.destroy()
      viewRef.current = null
    }
  }, [themeCompartment])

  useEffect(() => {
    const view = viewRef.current

    if (!view || view.state.doc.toString() === value) return

    view.dispatch({
      annotations: ExternalChange.of(true),
      changes: {
        from: 0,
        insert: value,
        to: view.state.doc.length,
      },
    })
  }, [value])

  useEffect(() => {
    const view = viewRef.current

    if (!view) return

    view.dispatch({
      effects: themeCompartment.reconfigure(editorTheme(isDark)),
    })
  }, [isDark, themeCompartment])

  return (
    <div
      className="h-full min-h-0 overflow-hidden [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto"
      ref={containerRef}
    />
  )
}

function editorTheme(isDark: boolean): Extension {
  const base = EditorView.theme({
    '.cm-activeLine': {
      backgroundColor: 'color-mix(in oklab, var(--color-muted) 55%, transparent)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: 'var(--color-ink)',
    },
    '.cm-content': {
      caretColor: 'var(--color-ink)',
      fontFamily: 'var(--font-mono)',
      lineHeight: '1.75',
      padding: '20px 0',
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'var(--color-muted-soft)',
      paddingLeft: '6px',
    },
    '.cm-line': {
      padding: '0 20px',
    },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: 'color-mix(in oklab, var(--color-hairline-strong) 65%, transparent)',
    },
    '.cm-tooltip': {
      backgroundColor: 'var(--color-popover)',
      border: '1px solid var(--color-border)',
      color: 'var(--color-popover-foreground)',
    },
    '&': {
      backgroundColor: 'transparent',
      color: 'var(--color-foreground)',
      fontSize: '14px',
    },
    '&.cm-focused': {
      outline: 'none',
    },
  })

  return isDark ? [oneDark, base] : [base]
}
