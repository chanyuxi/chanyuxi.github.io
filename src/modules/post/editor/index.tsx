import { MAX_POST_TITLE_LENGTH } from '@shared/constants/posts'
import { PostErrorCode } from '@shared/contracts/posts'
import ArrowLeft from '~icons/lucide/arrow-left'
import Send from '~icons/lucide/send'
import { Link } from 'react-router'

import { ApiError } from '@/api'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import { DeletePostDialog } from './components/delete-post-dialog'
import { LeaveWithoutSavingDialog } from './components/leave-without-saving-dialog'
import { PostDetailsPopover } from './components/post-details-popover'
import { PostEditorWorkspace } from './components/post-editor-workspace'
import { PublishPostDialog } from './components/publish-post-dialog'
import { usePostEditorController } from './controller'

export default function PostEditorPage() {
  const controller = usePostEditorController()

  const {
    authStatus,
    blocker,
    deleteOpen,
    detailsOpen,
    draft,
    errorMessage,
    handleDelete,
    handlePublish,
    handleSaveDraft,
    hasConflict,
    id,
    isDeleting,
    isHydrating,
    isNew,
    isPublishing,
    isSaving,
    loadLatest,
    postQuery,
    publishOpen,
    setDeleteOpen,
    setDetailsOpen,
    setPublishOpen,
    status,
    updateDraft,
    updateSlug,
    updateTitle,
  } = controller

  if (authStatus === 'loading' || (id && (postQuery.isPending || isHydrating))) {
    return <EditorLoading />
  }

  if (id && postQuery.isError && !postQuery.data) {
    const isUnavailable = postQuery.error instanceof ApiError
      && (postQuery.error.code === PostErrorCode.Forbidden
        || postQuery.error.code === PostErrorCode.NotFound)

    return (
      <section className="min-h-page section-spacing">
        <div className="base-container max-w-2xl text-center">
          <p className="section-eyebrow">Post editor</p>
          <h1 className="display-heading mt-4">
            {isUnavailable
              ? 'This post is unavailable.'
              : 'This post could not be loaded.'}
          </h1>
          <p className="section-body mt-4">
            {isUnavailable
              ? 'It may have been removed, or you may not have permission to edit it.'
              : 'Check your connection and try again.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button render={<Link to="/post/mine" />} variant="outline">
              <ArrowLeft className="size-4" />
              My posts
            </Button>
            {!isUnavailable
              ? <Button onClick={() => postQuery.refetch()}>Try again</Button>
              : null}
          </div>
        </div>
      </section>
    )
  }

  const publishOptionsLabel = status === 'published'
    ? 'Save or update post'
    : 'Save or publish post'

  return (
    <>
      <section className="min-h-page section-spacing">
        <div className="base-container">
          <header>
            <div className="flex items-center gap-2 sm:gap-3">
              <Input
                aria-label="Post title"
                autoComplete="off"
                className="flex-1"
                maxLength={MAX_POST_TITLE_LENGTH}
                onChange={event => updateTitle(event.target.value)}
                placeholder="Untitled post"
                value={draft.title}
                variant="title"
              />

              <div
                aria-label="Post actions"
                className="flex shrink-0 items-center gap-1"
                role="toolbar"
              >
                <Button
                  aria-label="Back to my posts"
                  render={<Link to="/post/mine" />}
                  size="icon"
                  title="Back to my posts"
                  variant="ghost"
                >
                  <ArrowLeft className="size-4" />
                </Button>

                <PostDetailsPopover
                  description={draft.description}
                  isNew={isNew}
                  onDescriptionChange={value => updateDraft({ description: value })}
                  onOpenChange={setDetailsOpen}
                  onRequestDelete={() => {
                    setDetailsOpen(false)
                    setDeleteOpen(true)
                  }}
                  onSlugChange={updateSlug}
                  onTagsChange={value => updateDraft({ tags: value })}
                  open={detailsOpen}
                  slug={draft.slug}
                  status={status}
                  tags={draft.tags}
                />

                <Button
                  aria-label={publishOptionsLabel}
                  onClick={() => setPublishOpen(true)}
                  size="icon"
                  title={publishOptionsLabel}
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 border-b border-hairline" />
          </header>

          {errorMessage
            ? (
                <Alert className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <span>{errorMessage}</span>
                  {hasConflict
                    ? (
                        <Button
                          onClick={() => loadLatest()}
                          size="sm"
                          variant="outline"
                        >
                          Load latest, discard local edits
                        </Button>
                      )
                    : null}
                </Alert>
              )
            : null}

          <div className="mt-6 min-w-0">
            <PostEditorWorkspace
              onChange={contentMd => updateDraft({ contentMd })}
              value={draft.contentMd}
            />
          </div>
        </div>
      </section>

      <DeletePostDialog
        isDeleting={isDeleting}
        onDelete={() => handleDelete()}
        onOpenChange={setDeleteOpen}
        open={deleteOpen}
      />

      <PublishPostDialog
        isPublishing={isPublishing}
        isSaving={isSaving}
        onOpenChange={setPublishOpen}
        onPublish={() => handlePublish()}
        onSave={() => handleSaveDraft()}
        open={publishOpen}
        status={status}
      />

      <LeaveWithoutSavingDialog blocker={blocker} />
    </>
  )
}

function EditorLoading() {
  return (
    <section className="min-h-page section-spacing">
      <div className="base-container">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="mt-4 h-px" />
        <Skeleton className="mt-9 h-96" />
      </div>
    </section>
  )
}
