import type { ColumnDef } from "@tanstack/react-table"

export type FilterType = "text" | "select"

export interface FilterOption {
    label: string
    value: string
}

export interface FilterConfig {
    key: string
    label: string
    type: FilterType
    options?: FilterOption[]
    placeholder?: string
}

export interface DataTableColumnMeta {
    label?: string
    filter?: {
        type: FilterType
        options?: FilterOption[]
        placeholder?: string
    }
    searchable?: boolean
}

export type DataTableColumnDef<T, TValue = unknown> = ColumnDef<T, TValue> & {
    meta?: DataTableColumnMeta
}

export interface DataTableProps<T> {
    data: T[]
    columns: DataTableColumnDef<T>[]

    page?: number
    pageSize?: number
    totalElements?: number

    defaultPageSize?: number
    sort?: string
    onSortChange?: (sort: string) => void

    search?: string
    onSearchChange?: (value: string) => void

    filters?: Record<string, unknown>
    onFilterChange?: (filters: Record<string, unknown>) => void

    defaultVisibleColumnIds?: string[]
    loading?: boolean
    onPageChange?: (page: number) => void
}

export interface PageRequest {
    page: number
    size: number
    sort?: string
    search?: string
    filters?: Record<string, unknown>
}

export interface PageResponse<T> {
    data: T[]
    page: number
    size: number
    totalElements: number
    totalPages: number
}
