import * as React from "react"
import { useQuery } from "@tanstack/react-query"

import { DataTable } from "@/components/data-table/data-table"
import type {
    DataTableColumnDef,
    PageRequest,
    PageResponse,
} from "@/components/data-table/types"

type User = {
    id: number
    name: string
    email: string
    role: "ADMIN" | "USER" | "MANAGER"
    status: "ACTIVE" | "INACTIVE"
    team: "Platform" | "Growth" | "Support"
    createdAt: string
}

const generateMockUsers = (count: number): User[] => {
    const roles = ["ADMIN", "USER", "MANAGER"] as const
    const statuses = ["ACTIVE", "INACTIVE"] as const
    const teams = ["Platform", "Growth", "Support"] as const

    return Array.from({ length: count }).map((_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        role: roles[index % roles.length],
        status: statuses[index % statuses.length],
        team: teams[index % teams.length],
        createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    }))
}

const ALL_USERS = generateMockUsers(137)

const USER_COLUMNS: DataTableColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
        meta: {
            label: "ID",
            searchable: false,
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        meta: {
            label: "Name",
            filter: {
                type: "text",
                placeholder: "Filter by name",
            },
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        meta: {
            label: "Email",
            filter: {
                type: "text",
                placeholder: "Filter by email",
            },
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        meta: {
            label: "Role",
            filter: {
                type: "select",
                placeholder: "Choose a role",
                options: [
                    { label: "Admin", value: "ADMIN" },
                    { label: "User", value: "USER" },
                    { label: "Manager", value: "MANAGER" },
                ],
            },
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        meta: {
            label: "Status",
            filter: {
                type: "select",
                placeholder: "Choose a status",
                options: [
                    { label: "Active", value: "ACTIVE" },
                    { label: "Inactive", value: "INACTIVE" },
                ],
            },
        },
    },
    {
        accessorKey: "team",
        header: "Team",
        meta: {
            label: "Team",
            filter: {
                type: "select",
                placeholder: "Choose a team",
                options: [
                    { label: "Platform", value: "Platform" },
                    { label: "Growth", value: "Growth" },
                    { label: "Support", value: "Support" },
                ],
            },
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) =>
            new Date(row.original.createdAt).toLocaleDateString(),
        meta: {
            label: "Created At",
        },
    },
]

const applyUserSearch = (rows: User[], search?: string) => {
    if (!search?.trim()) return rows

    const query = search.trim().toLowerCase()

    return rows.filter(
        (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query) ||
            user.status.toLowerCase().includes(query) ||
            user.team.toLowerCase().includes(query)
    )
}

const applyUserFilters = (rows: User[], filters?: Record<string, unknown>) => {
    if (!filters) return rows

    return rows.filter((user) => {
        if (
            typeof filters.name === "string" &&
            filters.name.trim().length > 0 &&
            !user.name.toLowerCase().includes(filters.name.trim().toLowerCase())
        ) {
            return false
        }

        if (
            typeof filters.email === "string" &&
            filters.email.trim().length > 0 &&
            !user.email.toLowerCase().includes(filters.email.trim().toLowerCase())
        ) {
            return false
        }

        if (filters.role && user.role !== filters.role) return false
        if (filters.status && user.status !== filters.status) return false
        if (filters.team && user.team !== filters.team) return false

        return true
    })
}

const applyUserSort = (rows: User[], sort?: string) => {
    if (!sort) return rows

    const [field, direction] = sort.split(",")

    return [...rows].sort((left, right) => {
        const leftValue = left[field as keyof User]
        const rightValue = right[field as keyof User]

        if (leftValue === rightValue) return 0
        if (leftValue < rightValue) return direction === "desc" ? 1 : -1
        return direction === "desc" ? -1 : 1
    })
}

const mockFetchUsers = async ({
    page,
    size,
    sort,
    search,
    filters,
}: PageRequest): Promise<PageResponse<User>> => {
    await new Promise((resolve) => setTimeout(resolve, 350))

    const filteredUsers = applyUserSort(
        applyUserFilters(applyUserSearch(ALL_USERS, search), filters),
        sort
    )

    const start = page * size
    const end = start + size

    return {
        data: filteredUsers.slice(start, end),
        page,
        size,
        totalElements: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / size),
    }
}

export function DataTableDemoPage() {
    // Server-mode state: table interactions are sent back into the query key.
    const [page, setPage] = React.useState(0)
    const [sort, setSort] = React.useState("")
    const [search, setSearch] = React.useState("")
    const [filters, setFilters] = React.useState<Record<string, unknown>>({})

    const paginatedUsersQuery = useQuery({
        queryKey: ["mock-users", page, sort, search, filters],
        queryFn: () =>
            mockFetchUsers({
                page,
                size: 10,
                sort,
                search,
                filters,
            }),
    })

    return (
        <div className="space-y-10 p-6">
            <section className="space-y-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">Data Table Demo</h1>
                    <p className="text-sm text-muted-foreground">
                        The first table simulates backend pagination, sorting, search,
                        and filtering. The second table uses the same component with the
                        full dataset loaded on the client.
                    </p>
                </div>

                <DataTable
                    columns={USER_COLUMNS}
                    data={paginatedUsersQuery.data?.data ?? []}
                    page={paginatedUsersQuery.data?.page}
                    pageSize={paginatedUsersQuery.data?.size}
                    totalElements={paginatedUsersQuery.data?.totalElements}
                    sort={sort}
                    onSortChange={(nextSort) => {
                        setSort(nextSort)
                        setPage(0)
                    }}
                    search={search}
                    onSearchChange={(nextSearch) => {
                        setSearch(nextSearch)
                        setPage(0)
                    }}
                    filters={filters}
                    onFilterChange={(nextFilters) => {
                        setFilters(nextFilters)
                        setPage(0)
                    }}
                    defaultVisibleColumnIds={[
                        "id",
                        "name",
                        "email",
                        "role",
                        "status",
                        "createdAt",
                    ]}
                    loading={paginatedUsersQuery.isLoading}
                    onPageChange={setPage}
                />
            </section>

            <section className="space-y-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold">Client-side Mode</h2>
                    <p className="text-sm text-muted-foreground">
                        No backend pagination props are passed here. Search, sort, filters,
                        and pagination are applied against the loaded data in the browser.
                    </p>
                </div>

                <DataTable
                    columns={USER_COLUMNS}
                    data={ALL_USERS}
                    defaultPageSize={8}
                    defaultVisibleColumnIds={[
                        "name",
                        "email",
                        "status",
                        "team",
                        "createdAt",
                    ]}
                />
            </section>
        </div>
    )
}

/*
Sample hook for a real backend integration:

export function useUsersTable(request: PageRequest) {
    return useQuery({
        queryKey: ["users-table", request],
        queryFn: async (): Promise<PageResponse<User>> => {
            const response = await axios.get("/api/users", {
                params: {
                    page: request.page,
                    size: request.size,
                    sort: request.sort,
                    search: request.search,
                    ...request.filters,
                },
            })

            return response.data
        },
    })
}
*/
