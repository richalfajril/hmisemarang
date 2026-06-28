'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/DropdownMenu'
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff, Star, Quote } from 'lucide-react'
import { getOptimizedUrl } from '@/shared/lib/cloudinary-upload'
import { deleteTestimonialAction, togglePublishTestimonialAction } from '../api/actions'
import { EmptyState } from '@/shared/ui/EmptyState'

type TestimonialEntry = {
  id: string
  name: string
  title: string
  photo_url: string | null
  featured: boolean
  is_published: boolean
  display_order: number
  updated_at: string | Date
}

export function TestimonialList({ testimonials }: { testimonials: TestimonialEntry[] }) {
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState('')

  const filtered = testimonials.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus testimoni ini? Tindakan tidak dapat dibatalkan.')) return
    startTransition(async () => {
      const res = await deleteTestimonialAction(id)
      if (res.success) toast.success(res.message)
      else toast.error(res.message)
    })
  }

  const handleToggle = (id: string) => {
    startTransition(async () => {
      const res = await togglePublishTestimonialAction(id)
      if (res.success) toast.success(res.message)
      else toast.error(res.message)
    })
  }

  if (testimonials.length === 0) {
    return (
      <EmptyState
        icon={<Quote className="h-10 w-10 text-muted-foreground" />}
        title="Belum ada testimoni"
        description="Tambahkan kutipan tokoh/alumni untuk ditampilkan di halaman utama."
      />
    )
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Cari berdasarkan nama..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Diperbarui</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id} className={isPending ? 'opacity-60' : ''}>
                <TableCell>
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-emerald-100">
                    {t.photo_url ? (
                      <Image src={getOptimizedUrl(t.photo_url)} alt={t.name} fill className="object-cover" sizes="40px" unoptimized />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
                        {t.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="max-w-[220px] truncate text-muted-foreground">{t.title}</TableCell>
                <TableCell>
                  {t.featured ? (
                    <Badge variant="secondary" className="gap-1">
                      <Star className="h-3 w-3 fill-current" /> Featured
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={t.is_published ? 'default' : 'outline'}>
                    {t.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>{t.display_order}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(t.updated_at), 'd MMM yyyy', { locale: idLocale })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isPending}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/testimonials/${t.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggle(t.id)}>
                        {t.is_published ? (
                          <><EyeOff className="mr-2 h-4 w-4" /> Unpublish</>
                        ) : (
                          <><Eye className="mr-2 h-4 w-4" /> Publish</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(t.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
