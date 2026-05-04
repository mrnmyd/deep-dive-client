import type { Table as TanstackTable } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Props<TData> {
    search: string
    onSearchChange: (value: string) => void
    searchPlaceholder?: string
    table: TanstackTable<TData>
}

export function DataTableToolbar<TData>({
    search,
    onSearchChange,
    searchPlaceholder,
    table,
}: Props<TData>) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
                placeholder={searchPlaceholder ?? "Search..."}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="max-w-sm"
            />

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {(column.columnDef.meta as { label?: string } | undefined)?.label ?? column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
