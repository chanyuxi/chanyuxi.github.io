import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import XIcon from '~icons/lucide/x'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utils'

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogContent({
  children,
  className,
  showCloseButton = true,
  variant = 'default',
  ...props
}: {
  showCloseButton?: boolean
  variant?: 'default' | 'image'
} & DialogPrimitive.Popup.Props) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        className={cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-0 overflow-hidden rounded-2xl bg-popover text-sm text-popover-foreground ring-1 ring-foreground/10 transition-[opacity,scale] duration-200 ease-out outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none sm:max-w-md',
          variant === 'image'
          && 'w-auto gap-0 rounded bg-white p-3 shadow-lg ring-0 dark:shadow-none',
          className,
        )}
        data-slot="dialog-content"
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={(
              <Button
                aria-label="Close"
                className="absolute top-4 right-4"
                size="icon-sm"
                variant="muted"
              />
            )}
          >
            <XIcon />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cn(
        'text-sm leading-6 text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
        className,
      )}
      data-slot="dialog-description"
      {...props}
    />
  )
}

function DialogFooter({
  children,
  className,
  showCloseButton = false,
  ...props
}: {
  showCloseButton?: boolean
} & React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mt-6 flex flex-col-reverse gap-2 border-t bg-muted/40 px-6 py-4 **:data-[slot=button]:w-full sm:flex-row sm:justify-end sm:**:data-[slot=button]:w-auto sm:**:data-[slot=button]:min-w-28',
        className,
      )}
      data-slot="dialog-footer"
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-3 px-6 pt-6', className)}
      data-slot="dialog-header"
      {...props}
    />
  )
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        'fixed inset-0 isolate z-50 bg-black/20 transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs motion-reduce:transition-none dark:bg-black/45',
        className,
      )}
      data-slot="dialog-overlay"
      {...props}
    />
  )
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cn(
        'pr-8 font-serif text-2xl leading-tight font-light tracking-tight text-ink dark:text-stone-50',
        className,
      )}
      data-slot="dialog-title"
      {...props}
    />
  )
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
