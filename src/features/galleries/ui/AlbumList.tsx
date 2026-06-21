'use client'

import { Card, CardContent } from '@/shared/ui/ui/Card'
import { Badge } from '@/shared/ui/ui/Badge'
import { Button } from '@/shared/ui/ui/Button'
import { Image as ImageIcon, MoreHorizontal, Edit, Trash2, Images } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/shared/ui/dropdown-menu'
import { useTransition } from 'react'
import { softDeleteAlbumAction } from '../api/actions'
import { toast } from 'sonner'
import Image from 'next/image'
import { getOptimizedUrl } from '@/shared/lib/cloudinary-client'

type AlbumEntry = {
  id: string
  title: string
  status: string
  created_at: string | Date
  cover_image_url?: string | null
  description?: string | null
  _count?: { photos: number }
}

interface AlbumListProps {
  albums: Array<AlbumEntry>
}

export function AlbumList({ albums }: AlbumListProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Hapus album "${title}" beserta isinya?`)) {
      startTransition(async () => {
        const result = await softDeleteAlbumAction(id)
        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      })
    }
  }

  if (albums.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/20 border border-dashed rounded-lg">
        <Images className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">Belum Ada Album Galeri</h3>
        <p className="text-muted-foreground mb-6">Mulai buat album untuk mendokumentasikan kegiatan.</p>
        <Link href="/dashboard/galleries/new">
          <Button>Buat Album Baru</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {albums.map((album) => (
        <Card key={album.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
          <Link href={`/dashboard/galleries/${album.id}`} className="block relative aspect-video bg-muted border-b">
            {album.cover_image_url ? (
              <Image
                src={getOptimizedUrl(album.cover_image_url)}
                alt={album.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 bg-muted/50">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
            <div className="absolute top-2 left-2">
              <Badge 
                variant={album.status === 'PUBLISHED' ? 'default' : album.status === 'DRAFT' ? 'secondary' : 'outline'}
                className={album.status === 'PUBLISHED' ? 'bg-green-500 hover:bg-green-600' : 'bg-background/80 backdrop-blur-sm'}
              >
                {album.status}
              </Badge>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md flex items-center gap-1.5">
              <ImageIcon className="h-3 w-3" />
              {album._count?.photos || 0}
            </div>
          </Link>
          <CardContent className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold line-clamp-1" title={album.title}>
                <Link href={`/dashboard/galleries/${album.id}`} className="hover:underline">
                  {album.title}
                </Link>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(album.created_at), 'd MMMM yyyy', { locale: idLocale })}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-muted-foreground line-clamp-1">{album.description || 'Tanpa deskripsi'}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isPending}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/dashboard/galleries/${album.id}/edit`}>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Info Album
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(album.id, album.title)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
