import type { PostStatus } from '@shared/constants/posts'

import Save from '~icons/lucide/save'
import Send from '~icons/lucide/send'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PublishPostDialogProps {
  isPublishing: boolean
  isSaving: boolean
  onOpenChange: (open: boolean) => void
  onPublish: () => void
  onSave: () => void
  open: boolean
  status: PostStatus
}

export function PublishPostDialog({
  isPublishing,
  isSaving,
  onOpenChange,
  onPublish,
  onSave,
  open,
  status,
}: PublishPostDialogProps) {
  const published = status === 'published'
  const publishLabel = published ? 'Update published post' : 'Publish post'
  const saveLabel = published ? 'Save changes' : 'Save draft'

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{published ? 'Update this post?' : 'Publish this post?'}</DialogTitle>
          <DialogDescription>
            {published
              ? 'Save your latest changes, or update the public post now.'
              : 'Keep this post as a draft, or make it publicly available now.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={isPublishing}
            loading={isSaving}
            onClick={onSave}
            variant="outline"
          >
            {!isSaving && <Save className="size-4" />}
            {saveLabel}
          </Button>
          <Button
            disabled={isSaving}
            loading={isPublishing}
            onClick={onPublish}
          >
            {!isPublishing && <Send className="size-4" />}
            {publishLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
