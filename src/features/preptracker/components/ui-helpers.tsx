import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function PageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-muted", className)}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

export function StatusBadge({ label, tone }: { label: string; tone: "gray" | "amber" | "green" | "red" | "blue" | "purple" | "teal" }) {
  const tones = {
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    green: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
    red: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
    teal: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200",
  }

  return <span className={cn("inline-flex rounded-md px-2 py-1 text-xs font-medium", tones[tone])}>{label}</span>
}
