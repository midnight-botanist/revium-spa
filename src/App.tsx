import { useEffect, useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { fetchItems, type ItemRecord } from "@/lib/api"

function App() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 4

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [search])

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["items"],
    queryFn: ({ signal }) => fetchItems({ signal }),
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["items"] })
  }, [debouncedSearch, queryClient])

  const normalizedSearch = debouncedSearch.toLowerCase()
  const filteredItems = useMemo(() => {
    if (!data) {
      return []
    }
    if (!normalizedSearch) {
      return data
    }

    return data.filter((item) => {
      const nameValue = typeof item.name === "string" ? item.name : ""
      return nameValue.toLowerCase().includes(normalizedSearch)
    })
  }, [data, normalizedSearch])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const renderValue = (value: ItemRecord[keyof ItemRecord]) => {
    if (Array.isArray(value)) {
      return value.join(", ")
    }
    if (value === null || value === undefined) {
      return "—"
    }
    if (typeof value === "object") {
      return JSON.stringify(value)
    }
    return String(value)
  }

  return (
    <main className="min-h-screen bg-muted/40 py-10">
      <div className="container space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold">Product List</h1>
          <p className="text-muted-foreground">
            Items fetched from the remote JSON payload.
          </p>
        </header>

        <div className="space-y-2">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(event) => {
              queryClient.cancelQueries({ queryKey: ["items"] })
              setSearch(event.target.value)
            }}
          />
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} result{filteredItems.length === 1 ? "" : "s"}
            {isFetching && " • updating"}
          </p>
        </div>

        {isLoading && (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Loading items…
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-destructive/50 bg-card p-6 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load items."}
          </div>
        )}

        {data && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedItems.map((item, index) => {
              const title =
                typeof item.name === "string" && item.name.trim().length > 0
                  ? item.name
                  : `Item ${index + 1}`

              return (
                <Card key={item.id ?? `${title}-${index}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {Object.entries(item).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="font-medium text-muted-foreground">
                          {key}:
                        </span>
                        <span className="text-foreground">{renderValue(value)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {data && filteredItems.length === 0 && (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            No items match that search.
          </div>
        )}

        {data && filteredItems.length > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  disabled={currentPage === 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={pageNumber === currentPage}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationNext
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </main>
  )
}

export default App
