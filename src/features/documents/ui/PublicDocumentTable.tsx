'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Download, FileText, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/Table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { SmartPagination } from '@/shared/ui/SmartPagination'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import { getPublicDocumentUrlAction } from '../api/actions'

export type PublicDocument = {
  id: string
  title: string
  description: string | null
  published_at: string | Date | null
  categoryName: string
}

type SortKey = 'latest' | 'oldest' | 'az' | 'za'

export function PublicDocumentTable({
  documents,
  categories,
}: {
  documents: PublicDocument[]
  categories: string[]
}) {
  const search = useSearchParams().get('q') ?? ''
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<SortKey>('latest')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = documents.filter((d) => {
      const matchCat = category === 'all' || d.categoryName === category
      const matchSearch =
        !q ||
        d.title.toLowerCase().includes(q) ||
        (d.description?.toLowerCase().includes(q) ?? false)
      return matchCat && matchSearch
    })
    const t = (d: PublicDocument) => (d.published_at ? new Date(d.published_at).getTime() : 0)
    return [...list].sort((a, b) => {
      if (sort === 'latest') return t(b) - t(a)
      if (sort === 'oldest') return t(a) - t(b)
      if (sort === 'az') return a.title.localeCompare(b.title)
      return b.title.localeCompare(a.title)
    })
  }, [documents, search, category, sort])

  const {
    paginatedData,
    currentPage,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
  } = useClientPagination(filtered, 10)

  async function handleDownload(id: string) {
    setDownloadingId(id)
    const res = await getPublicDocumentUrlAction(id)
    setDownloadingId(null)
    if (res.success && res.url) window.open(res.url, '_blank', 'noopener')
    else toast.error('Gagal membuka dokumen.')
  }

  return (
    <div className="space-y-6">
      {/* Filter + Urutkan */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Filter</span>
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v)
              onPageChange(1)
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Urutkan</span>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="za">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-0 bg-emerald-700 hover:bg-emerald-700">
              <TableHead className="w-12 text-center font-semibold text-white">No</TableHead>
              <TableHead className="font-semibold text-white">Nama Dokumen / Deskripsi</TableHead>
              <TableHead className="font-semibold text-white">Kategori</TableHead>
              <TableHead className="text-center font-semibold text-white">Dokumen</TableHead>
              <TableHead className="font-semibold text-white">Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                  Tidak ada dokumen ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((d, i) => (
                <TableRow key={d.id} className={i % 2 === 1 ? 'bg-muted/40' : ''}>
                  <TableCell className="text-center text-muted-foreground">
                    {(currentPage - 1) * pageSize + i + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">{d.title}</p>
                        {d.description && (
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {d.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block whitespace-nowrap rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {d.categoryName}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      disabled={downloadingId === d.id}
                      onClick={() => handleDownload(d.id)}
                    >
                      {downloadingId === d.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span className="ml-1.5">Unduh</span>
                    </Button>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {d.published_at ? (
                      <div className="leading-tight">
                        <p>{format(new Date(d.published_at), 'dd MMM yyyy', { locale: idLocale })}</p>
                        <p className="text-xs text-muted-foreground/70">
                          {format(new Date(d.published_at), 'HH:mm')}
                        </p>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SmartPagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
