import type { useBlocker } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface LeaveWithoutSavingDialogProps {
  blocker: ReturnType<typeof useBlocker>
}

/** Confirmation shown when a navigation would discard unsaved edits. */
export function LeaveWithoutSavingDialog({ blocker }: LeaveWithoutSavingDialogProps) {
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open && blocker.state === 'blocked') blocker.reset()
      }}
      open={blocker.state === 'blocked'}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Leave without saving?</DialogTitle>
          <DialogDescription>
            You have unsaved changes. Leaving now will discard them.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              if (blocker.state === 'blocked') blocker.reset()
            }}
            variant="outline"
          >
            Keep editing
          </Button>
          <Button
            onClick={() => {
              if (blocker.state === 'blocked') blocker.proceed()
            }}
            variant="destructive"
          >
            Discard and leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
