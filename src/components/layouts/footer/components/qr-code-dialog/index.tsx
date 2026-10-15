import { lazy, Suspense, useState } from 'react'

import { Button } from '@/components/ui/button'

export interface QrCodeDialogProps {
  label: string
  value: string
}

const QrCodeDialogContent = lazy(() => import('./dialog'))

export function QrCodeDialog(props: QrCodeDialogProps) {
  const { label } = props
  const [requested, setRequested] = useState(false)

  if (!requested) {
    return (
      <Button
        aria-haspopup="dialog"
        onClick={() => setRequested(true)}
        type="button"
        variant="quiet"
      >
        {label}
      </Button>
    )
  }

  return (
    <Suspense
      fallback={(
        <Button
          aria-busy="true"
          aria-haspopup="dialog"
          disabled
          type="button"
          variant="quiet"
        >
          {label}
        </Button>
      )}
    >
      <QrCodeDialogContent {...props} />
    </Suspense>
  )
}
