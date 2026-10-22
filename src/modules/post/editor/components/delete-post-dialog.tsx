import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeletePostDialogProps {
  isDeleting: boolean
  onDelete: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function DeletePostDialog({
  isDeleting,
  onDelete,
  onOpenChange,
  open,
}: DeletePostDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this post?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Published links will stop working.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button loading={isDeleting} onClick={onDelete} variant="destructive">
            Delete post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
