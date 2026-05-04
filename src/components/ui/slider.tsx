import * as React from "react"
import { Slider } from "radix-ui"

import { cn } from "@/lib/utils"

function SliderPrimitive({
  className,
  ...props
}: React.ComponentProps<typeof Slider.Root>) {
  return (
    <Slider.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
        <Slider.Range className="absolute h-full bg-primary" />
      </Slider.Track>
      {props.value?.map((_, index) => (
        <Slider.Thumb
          key={index}
          className="block size-4 rounded-full border border-primary bg-background shadow-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
      {!props.value?.length && (
        <Slider.Thumb className="block size-4 rounded-full border border-primary bg-background shadow-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50" />
      )}
    </Slider.Root>
  )
}

export { SliderPrimitive as Slider }
