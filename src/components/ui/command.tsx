import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

function Command({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command"
      className={cn("flex flex-col overflow-hidden rounded-lg bg-popover", className)}
      {...props}
    />
  )
}

function CommandInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="flex items-center border-b border-border px-3">
      <input
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("max-h-60 overflow-y-auto overflow-x-hidden", className)} {...props} />
  )
}

function CommandEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("py-6 text-center text-sm", className)} {...props} />
  )
}

function CommandGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("overflow-hidden p-1", className)} {...props} />
}

type CommandItemProps = React.ComponentProps<"button"> & {
  selected?: boolean
}

function CommandItem({
  className,
  children,
  selected = false,
  ...props
}: CommandItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <Check
        className={cn("size-4", selected ? "opacity-100" : "opacity-0")}
      />
      <span className="flex-1 text-left">{children}</span>
    </button>
  )
}

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
}
