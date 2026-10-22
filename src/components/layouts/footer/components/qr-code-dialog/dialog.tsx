import type { QrCodeDialogProps } from '.'

import LoaderCircle from '~icons/lucide/loader-circle'
import { lazy, Suspense } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

const QrCode = lazy(() => import('@/components/common/qr-code'))

export default function QrCodeDialogContent({ label, value }: QrCodeDialogProps) {
  return (
    <Dialog defaultOpen>
      <DialogTrigger
        render={(
          <Button
            type="button"
            variant="quiet"
          />
        )}
      >
        {label}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        variant="image"
      >
        <Suspense fallback={<QrCodeLoading />}>
          <QrCode value={value} />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

function QrCodeLoading() {
  return (
    <div
      aria-live="polite"
      className="flex size-36 items-center justify-center bg-white"
      role="status"
    >
      <LoaderCircle
        aria-hidden="true"
        className="size-5 text-muted-foreground motion-safe:animate-spin"
      />
    </div>
  )
}
