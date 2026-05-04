import * as React from "react"
import { Popover } from "radix-ui"

import { cn } from "@/lib/utils"

const PopoverRoot = Popover.Root
const PopoverTrigger = Popover.Trigger
const PopoverAnchor = Popover.Anchor

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof Popover.Content>) {
  return (
    <Popover.Portal>
      <Popover.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out",
          className
        )}
        {...props}
      />
    </Popover.Portal>
  )
}

export {
  PopoverAnchor,
  PopoverContent,
  PopoverRoot as Popover,
  PopoverTrigger,
}
