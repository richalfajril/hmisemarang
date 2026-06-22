'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SmartPaginationProps {
  currentPage: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function SmartPagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}: SmartPaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  if (totalItems === 0) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 text-sm text-muted-foreground border-t mt-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <span>
          Menampilkan {startItem}–{endItem} dari {totalItems} entitas
        </span>
        <div className="flex items-center justify-center gap-2">
          <span>Tampilkan</span>
          <Select 
            value={pageSize.toString()} 
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[15, 30, 60].map(size => (
                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>per halaman</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium text-foreground w-12 text-center">
          {currentPage} / {Math.max(1, totalPages)}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
