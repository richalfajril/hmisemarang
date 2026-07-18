'use client'

import { Article, ArticleCategory, Commissariat } from '@prisma/client'
import { Button } from '@/shared/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Edit, MoreHorizontal, Trash, Send } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui/DropdownMenu'
import Link from 'next/link'
import { Badge } from '@/shared/ui/Badge'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Archive } from 'lucide-react'
import { useState, useTransition } from 'react'
import { softDeleteArticleAction, submitArticleAction, bulkArchiveArticlesAction } from '../api/actions'
import { toast } from 'sonner'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import { SmartPagination } from '@/shared/ui/SmartPagination'
import { useConfirm } from '@/shared/ui/ConfirmDialog'

type ArticleWithRelations = Article & {
  category: ArticleCategory
  commissariat: Commissariat
}

interface ArticleListProps {
  articles: ArticleWithRelations[]
}

const statusColorMap: Record<string, string> = {
  DRAFT: 'bg-slate-200 text-slate-700',
  SUBMITTED: 'bg-yellow-200 text-yellow-800',
  REVISION: 'bg-orange-200 text-orange-800',
  APPROVED: 'bg-blue-200 text-blue-800',
  PUBLISHED: 'bg-green-200 text-green-800',
  ARCHIVED: 'bg-red-200 text-red-800',
}

export function ArticleList({ articles }: ArticleListProps) {
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const pagination = useClientPagination(articles, 15)

  const pageIds = pagination.paginatedData.map((a) => a.id)
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id))

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const togglePage = () =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (allPageSelected) pageIds.forEach((id) => next.delete(id))
      else pageIds.forEach((id) => next.add(id))
      return next
    })

  const confirm = useConfirm()

  const handleBulkArchive = async () => {
    const ids = [...selected]
    if (!ids.length) return
    if (!(await confirm({
      title: `Arsipkan ${ids.length} artikel?`,
      description: 'Artikel yang dipilih akan dipindahkan ke arsip.',
      confirmText: 'Arsipkan',
      variant: 'default',
    }))) return
    startTransition(async () => {
      const res = await bulkArchiveArticlesAction(ids)
      if (res.success) {
        toast.success(res.message)
        setSelected(new Set())
      } else toast.error(res.message)
    })
  }

  const handleDelete = async (id: string) => {
    if (!(await confirm({
      title: 'Hapus artikel ini?',
      description: 'Artikel akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.',
    }))) return

    startTransition(async () => {
      const result = await softDeleteArticleAction(id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  const handleSubmit = async (id: string) => {
    if (!(await confirm({
      title: 'Ajukan artikel untuk review?',
      description: 'Artikel akan dikirim ke Cabang untuk di-review.',
      confirmText: 'Ajukan',
      variant: 'default',
    }))) return

    startTransition(async () => {
      const result = await submitArticleAction(id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="space-y-4">
      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-2.5">
          <span className="text-sm font-medium">{selected.size} dipilih</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())} disabled={isPending}>
              Batal
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkArchive} disabled={isPending}>
              <Archive className="mr-2 h-4 w-4" /> Arsipkan
            </Button>
          </div>
        </div>
      )}
      <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox checked={allPageSelected} onCheckedChange={togglePage} aria-label="Pilih semua" />
            </TableHead>
            <TableHead className="w-[50px]">No.</TableHead>
            <TableHead>Judul</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Diperbarui</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Belum ada draf artikel.
              </TableCell>
            </TableRow>
          ) : (
            pagination.paginatedData.map((article, index) => {
              const rowIndex = (pagination.currentPage - 1) * 15 + index + 1
              return (
              <TableRow key={article.id} data-state={selected.has(article.id) ? 'selected' : undefined}>
                <TableCell>
                  <Checkbox
                    checked={selected.has(article.id)}
                    onCheckedChange={() => toggle(article.id)}
                    aria-label={`Pilih ${article.title}`}
                  />
                </TableCell>
                <TableCell>{rowIndex}</TableCell>
                <TableCell className="max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                  <div className="font-bold text-base truncate" title={article.title}>{article.title}</div>
                  <div className="text-xs text-muted-foreground truncate" title={[article.author_name, article.commissariat.name].filter(Boolean).join(' - ')}>{[article.author_name, article.commissariat.name].filter(Boolean).join(' - ')}</div>
                </TableCell>
                <TableCell>{article.category.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`w-full ${statusColorMap[article.status] || ''}`}>
                    {article.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(article.updated_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      
                      <Link href={`/dashboard/articles/${article.id}/edit`} prefetch>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Draf
                        </DropdownMenuItem>
                      </Link>

                      {article.status === 'DRAFT' && (
                        <DropdownMenuItem 
                          className="cursor-pointer text-blue-600 focus:text-blue-600"
                          onClick={() => handleSubmit(article.id)}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Ajukan Review
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem 
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => handleDelete(article.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Hapus (Soft Delete)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
      </div>
      <SmartPagination {...pagination} />
    </div>
  )
}
