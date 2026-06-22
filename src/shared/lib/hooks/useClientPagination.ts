import { useState } from 'react'

export function useClientPagination<T>(data: T[], initialPageSize = 15) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / pageSize)

  // Ensure current page is valid when data size shrinks
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages))

  const paginatedData = data.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize)

  const onPageChange = (page: number) => setCurrentPage(page)
  const onPageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return {
    paginatedData,
    currentPage: safeCurrentPage,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange
  }
}
