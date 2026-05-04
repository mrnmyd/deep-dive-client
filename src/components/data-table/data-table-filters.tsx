import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import type { DataTableColumnDef } from "./types"

interface Props {
    columns: DataTableColumnDef<unknown>[]
    filters: Record<string, unknown>
    onRemoveFilter: (key: string) => void
}

export function DataTableFilters({ columns, filters, onRemoveFilter }: Props) {
    const activeEntries = Object.entries(filters).filter(([, value]) => {
        if (value === undefined || value === null) return false
        if (typeof value === "string") return value.trim().length > 0
        return true
    })

    if (!activeEntries.length) return null

    const getColumnId = (column: DataTableColumnDef<unknown>, index: number) => {
        const definition = column as {
            id?: string
            accessorKey?: string
        }

        return definition.id ?? definition.accessorKey ?? `column-${index}`
    }

    const getColumnLabel = (key: string) => {
        const column = columns.find((item, index) => {
            return getColumnId(item, index) === key
        })

        return column?.meta?.label ?? key
    }

    const getFilterValueLabel = (key: string, value: unknown) => {
        const column = columns.find((item, index) => {
            return getColumnId(item, index) === key
        })

        const option = column?.meta?.filter?.options?.find(
            (item) => item.value === value
        )

        return option?.label ?? String(value)
    }

    return (
        <div className="flex flex-wrap gap-2">
            {activeEntries.map(([key, value]) => (
                <Badge
                    key={key}
                    variant="secondary"
                    className="gap-1 rounded-full px-3 py-1"
                >
                    <span>
                        {getColumnLabel(key)}: {getFilterValueLabel(key, value)}
                    </span>
                    <button
                        type="button"
                        onClick={() => onRemoveFilter(key)}
                        className="rounded-full p-0.5 transition-colors hover:bg-black/10"
                        aria-label={`Remove ${getColumnLabel(key)} filter`}
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}
        </div>
    )
}
