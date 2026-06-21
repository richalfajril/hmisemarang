'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { FileText, MoreHorizontal, Edit, Trash2, Download } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/shared/ui/DropdownMenu'
import { useTransition } from 'react'
import { softDeleteDocumentAction, getSignedDocumentUrlAction } from '../api/actions'
import { toast } from 'sonner'

type DocumentEntry = {
  id: string
  title: string
  status: string
  created_at: string | Date
  file_url: string
  file_size?: number | null
  category?: { name: string } | null
}

interface DocumentListProps {
  documents: Array<DocumentEntry>
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function DocumentList({ documents }: DocumentListProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Hapus dokumen "${title}"?`)) {
      startTransition(async () => {
        const result = await softDeleteDocumentAction(id)
        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      })
    }
  }

  const handleDownload = async (fileUrl: string) => {
    // Gunakan Server Action untuk membuat Signed URL
    const result = await getSignedDocumentUrlAction(fileUrl)
    if (result.success && result.url) {
      window.open(result.url, '_blank')
    } else {
      toast.error('Gagal membuat tautan unduhan yang aman.')
    }
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/20 border border-dashed rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">Belum Ada Dokumen</h3>
        <p className="text-muted-foreground mb-6">Mulai unggah dokumen untuk organisasi Anda.</p>
        <Link href="/dashboard/documents/new">
          <Button>Unggah Dokumen</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Nama Dokumen</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Ukuran</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium line-clamp-1">{doc.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Diunggah: {format(new Date(doc.created_at), 'dd MMM yyyy', { locale: idLocale })}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{doc.category?.name}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {doc.file_size ? formatBytes(doc.file_size) : '-'}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={doc.status === 'PUBLISHED' ? 'default' : doc.status === 'DRAFT' ? 'secondary' : 'outline'}
                  className={doc.status === 'PUBLISHED' ? 'bg-green-500' : ''}
                >
                  {doc.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isPending}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDownload(doc.file_url)}>
                      <Download className="mr-2 h-4 w-4" />
                      Unduh (Secure)
                    </DropdownMenuItem>
                    <Link href={`/dashboard/documents/${doc.id}/edit`}>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Metadata
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(doc.id, doc.title)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
