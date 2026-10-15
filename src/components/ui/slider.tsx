import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import * as React from 'react'

import { cn } from '@/libs/utils'

// The wrapper exposes a single-value API: this project has no range-slider
// use case, so call sites get exact `number` types instead of the union.
type SliderProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  'defaultValue' | 'onValueChange' | 'value'
> & {
  onValueChange?: (value: number) => void
  value?: number
}

function Slider({
  className,
  onValueChange,
  value,
  ...props
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn(
        'relative flex w-full touch-none items-center select-none data-disabled:opacity-50',
        className,
      )}
      data-slot="slider"
      onValueChange={onValueChange}
      value={value}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex h-5 w-full items-center">
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Indicator className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-4 rounded-full border border-primary bg-background shadow-soft transition-shadow duration-300 outline-none hover:ring-3 hover:ring-ring/30 focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none" />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
