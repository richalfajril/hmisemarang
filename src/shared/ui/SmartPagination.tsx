'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface SmartPaginationProps {
  currentPage: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
}

/** Deret nomor halaman dengan ellipsis (…) bila banyak. */
function pageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const out: (number | '...')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) out.push('...')
  for (let i = start; i <= end; i++) out.push(i)
  if (end < total - 1) out.push('...')
  out.push(total)
  return out
}

export function SmartPagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: SmartPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)
  // Selalu sertakan pageSize aktif di opsi (mis. 15 dari dashboard).
  const options = Array.from(new Set([pageSize, ...pageSizeOptions])).sort((a, b) => a - b)

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
      {/* Kiri: pemilih jumlah + info */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <div className="flex items-center gap-2">
          <span>Tampilkan:</span>
          <Select value={pageSize.toString()} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger className="h-9 w-[72px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span>
          Menampilkan <span className="font-semibold text-foreground">{startItem}</span> -{' '}
          <span className="font-semibold text-foreground">{endItem}</span> dari{' '}
          <span className="font-semibold text-foreground">{totalItems}</span>
        </span>
      </div>

      {/* Kanan: navigasi */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onPageChange(1)} disabled={currentPage <= 1} aria-label="Halaman pertama">
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} aria-label="Sebelumnya">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageRange(currentPage, totalPages).map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="w-9 text-center">…</span>
          ) : (
            <Button
              key={p}
              variant={p === currentPage ? 'default' : 'outline'}
              size="icon"
              className="h-9 w-9"
              onClick={() => onPageChange(p)}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </Button>
          )
        )}

        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} aria-label="Berikutnya">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onPageChange(totalPages)} disabled={currentPage >= totalPages} aria-label="Halaman terakhir">
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
