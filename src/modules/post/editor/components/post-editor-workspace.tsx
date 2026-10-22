import type { EditorView } from '@codemirror/view'

import Eye from '~icons/lucide/eye'
import PencilLine from '~icons/lucide/pencil-line'
import { lazy, Suspense, useEffect, useId, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { runMarkdownCommand } from '../lib/markdown-commands'

import { EditorToolbar } from './editor-toolbar'
import { MarkdownEditor } from './markdown-editor'

const MarkdownPreview = lazy(async () => {
  const module = await import('./markdown-preview')

  return { default: module.MarkdownPreview }
})

type EditorMode = 'preview' | 'write'

interface PostEditorWorkspaceProps {
  onChange: (value: string) => void
  value: string
}

export function PostEditorWorkspace({
  onChange,
  value,
}: PostEditorWorkspaceProps) {
  const [editorView, setEditorView] = useState<EditorView | null>(null)
  const [mode, setMode] = useState<EditorMode>('write')
  const [previewOpened, setPreviewOpened] = useState(false)
  const id = useId()
  const previewPanelId = `${id}-preview-panel`
  const previewTabId = `${id}-preview-tab`
  const writePanelId = `${id}-write-panel`
  const writeTabId = `${id}-write-tab`

  useEffect(() => {
    if (mode !== 'write' || !editorView) return

    // CodeMirror measures lazily; ask for a fresh pass whenever the editor
    // becomes visible again after being hidden behind the preview tab.
    const frame = window.requestAnimationFrame(() => {
      editorView.requestMeasure()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [editorView, mode])

  return (
    <section
      aria-label="Post content"
      className="surface-card overflow-hidden rounded-xl"
    >
      <div className="flex items-center justify-between gap-4 border-b border-hairline bg-card px-3 py-2.5 sm:px-4">
        <div
          aria-label="Editor view"
          className="inline-flex items-center gap-1 rounded-full bg-muted p-1"
          role="tablist"
        >
          <Button
            aria-controls={writePanelId}
            aria-selected={mode === 'write'}
            id={writeTabId}
            onClick={() => setMode('write')}
            role="tab"
            size="sm"
            type="button"
            variant={mode === 'write' ? 'secondary' : 'ghost'}
          >
            <PencilLine className="size-3.5" />
            Write
          </Button>
          <Button
            aria-controls={previewPanelId}
            aria-selected={mode === 'preview'}
            id={previewTabId}
            onClick={() => {
              setMode('preview')
              setPreviewOpened(true)
            }}
            role="tab"
            size="sm"
            type="button"
            variant={mode === 'preview' ? 'secondary' : 'ghost'}
          >
            <Eye className="size-3.5" />
            Preview
          </Button>
        </div>

        <span className="hidden text-xs text-muted-foreground sm:inline">
          {mode === 'write' ? 'Markdown source' : 'Published appearance'}
        </span>
      </div>

      <div
        aria-labelledby={writeTabId}
        hidden={mode !== 'write'}
        id={writePanelId}
        role="tabpanel"
      >
        <EditorToolbar
          disabled={!editorView}
          onCommand={(command) => {
            if (editorView) runMarkdownCommand(editorView, command)
          }}
        />
        <div className="h-[calc(100svh-16rem)] max-h-192 min-h-96">
          <MarkdownEditor
            onChange={onChange}
            onReady={setEditorView}
            value={value}
          />
        </div>
      </div>

      <div
        aria-labelledby={previewTabId}
        hidden={mode !== 'preview'}
        id={previewPanelId}
        role="tabpanel"
      >
        <div className="min-h-[calc(100svh-16rem)] px-5 py-8 sm:px-8 lg:px-12">
          {previewOpened
            ? (
                <Suspense fallback={<PreviewLoading />}>
                  <MarkdownPreview active={mode === 'preview'} contentMd={value} />
                </Suspense>
              )
            : null}
        </div>
      </div>
    </section>
  )
}

function PreviewLoading() {
  return (
    <div className="space-y-4 py-8">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  )
}
