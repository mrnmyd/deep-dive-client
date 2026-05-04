import * as React from "react"
import { Checkbox } from "radix-ui"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

function CheckboxPrimitive({
  className,
  ...props
}: React.ComponentProps<typeof Checkbox.Root>) {
  return (
    <Checkbox.Root
      data-slot="checkbox"
      className={cn(
        "peer flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input bg-background outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <Checkbox.Indicator>
        <Check className="size-3.5" />
      </Checkbox.Indicator>
    </Checkbox.Root>
  )
}

export { CheckboxPrimitive as Checkbox }
