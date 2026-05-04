import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { Select } from "radix-ui"

import { cn } from "@/lib/utils"

const SelectRoot = Select.Root
const SelectGroup = Select.Group
const SelectValue = Select.Value

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Select.Trigger>) {
  return (
    <Select.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <Select.Icon asChild>
        <ChevronDown className="size-4 opacity-50" />
      </Select.Icon>
    </Select.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof Select.Content>) {
  return (
    <Select.Portal>
      <Select.Content
        position={position}
        className={cn(
          "z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md",
          className
        )}
        {...props}
      >
        <Select.Viewport className="p-1">{children}</Select.Viewport>
      </Select.Content>
    </Select.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Select.Item>) {
  return (
    <Select.Item
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pr-8 pl-2 text-sm outline-none focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <Select.ItemIndicator>
          <Check className="size-4" />
        </Select.ItemIndicator>
      </span>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
}

export {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot as Select,
  SelectTrigger,
  SelectValue,
}
