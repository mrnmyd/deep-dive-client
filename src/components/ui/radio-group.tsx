import * as React from "react"
import { RadioGroup } from "radix-ui"

import { cn } from "@/lib/utils"

function RadioGroupPrimitive({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroup.Root>) {
  return (
    <RadioGroup.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroup.Item>) {
  return (
    <RadioGroup.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-4 rounded-full border border-input text-primary outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroup.Indicator className="relative flex items-center justify-center">
        <span className="block size-2 rounded-full bg-current" />
      </RadioGroup.Indicator>
    </RadioGroup.Item>
  )
}

export { RadioGroupPrimitive as RadioGroup, RadioGroupItem }
