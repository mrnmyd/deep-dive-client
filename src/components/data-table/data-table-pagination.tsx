import { Button } from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"

interface DataTablePaginationProps {
    page: number
    pageSize: number
    totalElements: number

    onPageChange: (page: number) => void
}

export function DataTablePagination({
    page,
    pageSize,
    totalElements,
    onPageChange,
}: DataTablePaginationProps) {
    const totalPages = Math.ceil(totalElements / pageSize)

    // generate page numbers with ellipsis
    const getPages = () => {
        const pages: (number | "...")[] = []

        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i)
            }
        } else {
            const start = Math.max(0, page - 2)
            const end = Math.min(totalPages - 1, page + 2)

            if (start > 0) {
                pages.push(0)
                if (start > 1) pages.push("...")
            }

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (end < totalPages - 1) {
                if (end < totalPages - 2) pages.push("...")
                pages.push(totalPages - 1)
            }
        }

        return pages
    }

    const pages = getPages()

    return (
        <div className="flex items-center justify-end">
            <Pagination className="justify-end">
                <PaginationContent>
                    {/* Prev */}
                    <PaginationItem>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 0}
                        >
                            Prev
                        </Button>
                    </PaginationItem>

                    {/* Page Numbers */}
                    {pages.map((p, index) => (
                        <PaginationItem key={index}>
                            {p === "..." ? (
                                <span className="px-2 text-sm">...</span>
                            ) : (
                                <Button
                                    variant={p === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(p)}
                                >
                                    {p + 1}
                                </Button>
                            )}
                        </PaginationItem>
                    ))}

                    {/* Next */}
                    <PaginationItem>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages - 1}
                        >
                            Next
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}