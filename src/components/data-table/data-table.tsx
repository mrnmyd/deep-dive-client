import * as React from "react"
import {
    type Cell,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { DataTableColumnFilter } from "./data-table-column-filter"
import { DataTableFilters } from "./data-table-filters"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import type { DataTableColumnDef, DataTableProps } from "./types"

type AccessorValue = string | number | boolean | Date | null | undefined

function getColumnId<T>(column: DataTableColumnDef<T>, index: number) {
    const definition = column as {
        id?: string
        accessorKey?: string
    }

    return definition.id ?? definition.accessorKey ?? `column-${index}`
}

function getColumnLabel<T>(column: DataTableColumnDef<T>, index: number) {
    if (column.meta?.label) return column.meta.label

    const definition = column as {
        header?: unknown
    }

    if (typeof definition.header === "string") return definition.header
    return getColumnId(column, index)
}

function normalizeValue(value: AccessorValue) {
    if (value instanceof Date) return value.getTime()
    if (typeof value === "boolean") return Number(value)
    return value
}

function getSearchableText(value: unknown) {
    if (value === null || value === undefined) return ""
    if (value instanceof Date) return value.toISOString()
    return String(value).toLowerCase()
}

function getComparableValue<T>(row: T, column: DataTableColumnDef<T>, columnId: string) {
    const definition = column as {
        accessorFn?: (originalRow: T, index: number) => unknown
    }

    if (typeof definition.accessorFn === "function") {
        return normalizeValue(definition.accessorFn(row, 0) as AccessorValue)
    }

    return normalizeValue((row as Record<string, unknown>)[columnId] as AccessorValue)
}

function renderBodyCell<T>(cell: Cell<T, unknown>) {
    const rendered = flexRender(cell.column.columnDef.cell, cell.getContext())

    if (rendered !== null && rendered !== undefined) {
        return rendered
    }

    const value = cell.getValue()

    if (value === null || value === undefined) {
        return ""
    }

    return String(value)
}

function matchesFilter(value: unknown, filterValue: unknown) {
    if (filterValue === undefined || filterValue === null) return true
    if (typeof filterValue === "string" && filterValue.trim().length === 0) return true

    if (typeof filterValue === "string") {
        return getSearchableText(value).includes(filterValue.toLowerCase())
    }

    return value === filterValue
}

export function DataTable<T>({
    data,
    columns,
    page,
    pageSize,
    totalElements,
    defaultPageSize = 10,
    sort,
    onSortChange,
    search,
    onSearchChange,
    filters,
    onFilterChange,
    defaultVisibleColumnIds,
    loading,
    onPageChange,
}: DataTableProps<T>) {
    const isBackendPaginated =
        page !== undefined &&
        pageSize !== undefined &&
        totalElements !== undefined &&
        onPageChange !== undefined

    const [localPage, setLocalPage] = React.useState(0)
    const [localSearch, setLocalSearch] = React.useState(search ?? "")
    const [localSort, setLocalSort] = React.useState(sort ?? "")
    const [localFilters, setLocalFilters] = React.useState<Record<string, unknown>>(filters ?? {})

    React.useEffect(() => {
        if (search !== undefined) {
            setLocalSearch(search)
        }
    }, [search])

    React.useEffect(() => {
        if (sort !== undefined) {
            setLocalSort(sort)
        }
    }, [sort])

    React.useEffect(() => {
        if (filters !== undefined) {
            setLocalFilters(filters)
        }
    }, [filters])

    const initialVisibility = React.useMemo(() => {
        if (!defaultVisibleColumnIds?.length) return {}

        const visibleSet = new Set(defaultVisibleColumnIds)

        return columns.reduce<Record<string, boolean>>((acc, column, index) => {
            const columnId = getColumnId(column, index)
            acc[columnId] = visibleSet.has(columnId)
            return acc
        }, {})
    }, [columns, defaultVisibleColumnIds])

    const [columnVisibility, setColumnVisibility] =
        React.useState<Record<string, boolean>>(initialVisibility)

    React.useEffect(() => {
        setColumnVisibility(initialVisibility)
    }, [initialVisibility])

    const activeSearch = isBackendPaginated ? search ?? "" : localSearch
    const activeSort = isBackendPaginated ? sort ?? "" : localSort
    const activeFilters = React.useMemo(
        () => (isBackendPaginated ? filters ?? {} : localFilters),
        [filters, isBackendPaginated, localFilters]
    )

    const processedData = React.useMemo(() => {
        if (isBackendPaginated) {
            return data
        }

        let rows = [...data]

        if (activeSearch.trim()) {
            const query = activeSearch.trim().toLowerCase()

            rows = rows.filter((row) =>
                columns.some((column, index) => {
                    if (column.meta?.searchable === false) return false

                    const columnId = getColumnId(column, index)
                    const value = getComparableValue(row, column, columnId)

                    return getSearchableText(value).includes(query)
                })
            )
        }

        const applicableFilters = Object.entries(activeFilters).filter(([, value]) => {
            if (value === undefined || value === null) return false
            if (typeof value === "string") return value.trim().length > 0
            return true
        })

        if (applicableFilters.length) {
            rows = rows.filter((row) =>
                applicableFilters.every(([key, value]) => {
                    const columnIndex = columns.findIndex(
                        (column, index) => getColumnId(column, index) === key
                    )

                    if (columnIndex === -1) return true

                    const column = columns[columnIndex]
                    const rowValue = getComparableValue(row, column, key)

                    return matchesFilter(rowValue, value)
                })
            )
        }

        if (activeSort) {
            const [sortKey, sortDirection] = activeSort.split(",")
            const columnIndex = columns.findIndex(
                (column, index) => getColumnId(column, index) === sortKey
            )

            if (columnIndex !== -1) {
                const column = columns[columnIndex]

                rows.sort((left, right) => {
                    const leftValue = getComparableValue(left, column, sortKey)
                    const rightValue = getComparableValue(right, column, sortKey)

                    if (leftValue === rightValue) return 0
                    if (leftValue === undefined || leftValue === null) return 1
                    if (rightValue === undefined || rightValue === null) return -1

                    if (leftValue < rightValue) {
                        return sortDirection === "desc" ? 1 : -1
                    }

                    return sortDirection === "desc" ? -1 : 1
                })
            }
        }

        return rows
    }, [activeFilters, activeSearch, activeSort, columns, data, isBackendPaginated])

    const resolvedPageSize = isBackendPaginated ? pageSize! : defaultPageSize
    const resolvedPage = isBackendPaginated ? page! : localPage
    const resolvedTotalElements = isBackendPaginated
        ? totalElements!
        : processedData.length

    const paginatedData = React.useMemo(() => {
        if (isBackendPaginated) return processedData

        const start = resolvedPage * resolvedPageSize
        return processedData.slice(start, start + resolvedPageSize)
    }, [isBackendPaginated, processedData, resolvedPage, resolvedPageSize])

    const totalPages = Math.max(1, Math.ceil(resolvedTotalElements / resolvedPageSize))

    React.useEffect(() => {
        if (isBackendPaginated) return

        setLocalPage((currentPage) => {
            if (currentPage < totalPages) return currentPage
            return Math.max(totalPages - 1, 0)
        })
    }, [isBackendPaginated, totalPages])

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: paginatedData,
        columns,
        state: { columnVisibility },
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        manualPagination: true,
    })

    const handleSearchChange = (value: string) => {
        if (!isBackendPaginated) {
            setLocalSearch(value)
            setLocalPage(0)
        }

        onSearchChange?.(value)
    }

    const handleSort = (columnId: string) => {
        const currentSort = activeSort
        let nextSort = `${columnId},asc`

        if (currentSort.startsWith(columnId)) {
            nextSort = currentSort.endsWith("asc") ? `${columnId},desc` : ""
        }

        if (isBackendPaginated) {
            onSortChange?.(nextSort)
            return
        }

        setLocalSort(nextSort)
        setLocalPage(0)
        onSortChange?.(nextSort)
    }

    const handleFiltersChange = (nextFilters: Record<string, unknown>) => {
        if (!isBackendPaginated) {
            setLocalFilters(nextFilters)
            setLocalPage(0)
        }

        onFilterChange?.(nextFilters)
    }

    const handleFilterApply = (columnId: string, value: unknown) => {
        const nextFilters = { ...activeFilters }

        if (
            value === undefined ||
            value === null ||
            (typeof value === "string" && value.trim().length === 0)
        ) {
            delete nextFilters[columnId]
        } else {
            nextFilters[columnId] = value
        }

        handleFiltersChange(nextFilters)
    }

    const handleRemoveFilter = (columnId: string) => {
        const nextFilters = { ...activeFilters }
        delete nextFilters[columnId]
        handleFiltersChange(nextFilters)
    }

    const handlePageChange = (nextPage: number) => {
        if (isBackendPaginated) {
            onPageChange?.(nextPage)
            return
        }

        setLocalPage(nextPage)
    }

    return (
        <div className="space-y-4">
            <DataTableToolbar
                search={activeSearch}
                onSearchChange={handleSearchChange}
                table={table}
            />

            <DataTableFilters
                columns={columns as DataTableColumnDef<unknown>[]}
                filters={activeFilters}
                onRemoveFilter={handleRemoveFilter}
            />

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    if (header.isPlaceholder) {
                                        return <TableHead key={header.id} />
                                    }

                                    const columnIndex = columns.findIndex(
                                        (column, index) =>
                                            getColumnId(column, index) === header.column.id
                                    )
                                    const column = columns[columnIndex]
                                    const label = getColumnLabel(column, columnIndex)
                                    const filterConfig = column.meta?.filter
                                    const isSorted = activeSort.startsWith(header.column.id)
                                    const sortIcon = !isSorted ? (
                                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                    ) : activeSort.endsWith("asc") ? (
                                        <ArrowUp className="h-4 w-4" />
                                    ) : (
                                        <ArrowDown className="h-4 w-4" />
                                    )

                                    return (
                                        <TableHead key={header.id}>
                                            <div className="flex items-center justify-between gap-2">
                                                <Button
                                                    variant="ghost"
                                                    className="h-auto px-0 py-0 font-semibold hover:bg-transparent"
                                                    onClick={() => handleSort(header.column.id)}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {sortIcon}
                                                    </span>
                                                </Button>

                                                {filterConfig ? (
                                                    <DataTableColumnFilter
                                                        columnId={header.column.id}
                                                        label={label}
                                                        filterConfig={filterConfig}
                                                        value={activeFilters[header.column.id]}
                                                        onApply={(value) =>
                                                            handleFilterApply(header.column.id, value)
                                                        }
                                                    />
                                                ) : null}
                                            </div>
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            Array.from({ length: resolvedPageSize }).map((_, rowIndex) => (
                                <TableRow key={`skeleton-${rowIndex}`}>
                                    {table.getVisibleLeafColumns().map((column) => (
                                        <TableCell key={`${column.id}-${rowIndex}`}>
                                            <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {renderBodyCell(cell)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getVisibleLeafColumns().length || columns.length}
                                    className="h-24 text-center"
                                >
                                    No data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {resolvedTotalElements > 0 ? (
                <DataTablePagination
                    page={resolvedPage}
                    pageSize={resolvedPageSize}
                    totalElements={resolvedTotalElements}
                    onPageChange={handlePageChange}
                />
            ) : null}
        </div>
    )
}
