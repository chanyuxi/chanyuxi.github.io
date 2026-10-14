import { LoaderCircle } from 'lucide-react'
import { lazy, Suspense } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface QrCodeDialogProps {
  label: string
  value: string
}

const QrCode = lazy(() => import('@/components/common/qr-code'))

export function QrCodeDialog({ label, value }: QrCodeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={(
          <Button
            className="quiet-link h-auto p-0 font-normal hover:no-underline"
            type="button"
            variant="link"
          />
        )}
      >
        {label}
      </DialogTrigger>

      <DialogContent
        className="w-auto max-w-none gap-0 rounded bg-white p-3 shadow-lg ring-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          {label}
          {' '}
          QR code
        </DialogTitle>

        <Suspense fallback={<QrCodeLoading label={label} />}>
          <QrCode value={value} />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

function QrCodeLoading({ label }: { label: string }) {
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
      <span className="sr-only">
        Loading
        {' '}
        {label}
        {' '}
        QR code
      </span>
    </div>
  )
}
