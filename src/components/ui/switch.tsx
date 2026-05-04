import * as React from "react"
import { Switch } from "radix-ui"

import { cn } from "@/lib/utils"

function SwitchPrimitive({
  className,
  ...props
}: React.ComponentProps<typeof Switch.Root>) {
  return (
    <Switch.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent bg-input shadow-xs outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
        className
      )}
      {...props}
    >
      <Switch.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-5 rounded-full bg-background ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      />
    </Switch.Root>
  )
}

export { SwitchPrimitive as Switch }
