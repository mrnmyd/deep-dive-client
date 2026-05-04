import * as React from "react"
import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import type { DataTableColumnMeta } from "./types"

interface DataTableColumnFilterProps {
    columnId: string
    label: string
    filterConfig: NonNullable<DataTableColumnMeta["filter"]>
    value: unknown
    onApply: (value: unknown) => void
}

export function DataTableColumnFilter({
    columnId,
    label,
    filterConfig,
    value,
    onApply,
}: DataTableColumnFilterProps) {
    const [open, setOpen] = React.useState(false)
    const [draftValue, setDraftValue] = React.useState(value ?? "")

    React.useEffect(() => {
        setDraftValue(value ?? "")
    }, [value])

    const handleApply = () => {
        const nextValue =
            typeof draftValue === "string" ? draftValue.trim() : draftValue

        onApply(nextValue)
        setOpen(false)
    }

    const handleClear = () => {
        setDraftValue("")
        onApply("")
        setOpen(false)
    }

    const hasValue =
        typeof value === "string" ? value.trim().length > 0 : Boolean(value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(event) => event.stopPropagation()}
                >
                    <Filter
                        className={hasValue ? "text-primary" : "text-muted-foreground"}
                    />
                    <span className="sr-only">Filter {label}</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-72 space-y-3"
                onOpenAutoFocus={(event) => event.preventDefault()}
            >
                <div className="space-y-1">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">
                        Set a filter for {columnId}.
                    </p>
                </div>

                {filterConfig.type === "text" ? (
                    <Input
                        value={(draftValue as string) ?? ""}
                        placeholder={filterConfig.placeholder ?? `Filter ${label}`}
                        onChange={(event) => setDraftValue(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault()
                                handleApply()
                            }
                        }}
                    />
                ) : (
                    <Select
                        value={(draftValue as string) || ""}
                        onValueChange={(nextValue) => setDraftValue(nextValue)}
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder={filterConfig.placeholder ?? `Select ${label}`}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {filterConfig.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={handleClear}>
                        Clear
                    </Button>
                    <Button size="sm" onClick={handleApply}>
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
