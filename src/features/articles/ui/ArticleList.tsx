'use client'

import { Article, ArticleCategory, Commissariat } from '@prisma/client'
import { Button } from '@/shared/ui/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/ui/Table'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Edit, Eye, MoreHorizontal, Trash, Send } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import Link from 'next/link'
import { Badge } from '@/shared/ui/ui/Badge'
import { useTransition } from 'react'
import { softDeleteArticleAction, submitArticleAction } from '../api/actions'
import { toast } from 'sonner'

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

  const handleDelete = (id: string) => {
    if (!window.confirm('Yakin ingin menghapus artikel ini?')) return

    startTransition(async () => {
      const result = await softDeleteArticleAction(id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  const handleSubmit = (id: string) => {
    if (!window.confirm('Yakin ingin mengajukan artikel ini untuk di-review Cabang?')) return

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
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Diperbarui</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Belum ada draf artikel.
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <div className="font-medium">{article.title}</div>
                  <div className="text-xs text-muted-foreground">{article.commissariat.name}</div>
                </TableCell>
                <TableCell>{article.category.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColorMap[article.status] || ''}>
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
                      
                      <Link href={`/dashboard/articles/${article.id}/edit`}>
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
