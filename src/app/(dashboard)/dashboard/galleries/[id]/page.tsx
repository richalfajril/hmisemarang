import { prisma } from '@/shared/lib/prisma'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PhotoGrid } from '@/features/galleries/ui/PhotoGrid'
import { Badge } from '@/shared/ui/ui/Badge'
import { Button } from '@/shared/ui/ui/Button'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'



export default async function AlbumDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getUserSession()
  const { id } = await params
  
  if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  const album = await prisma.galleryAlbum.findUnique({
    where: { id, deleted_at: null },
    include: {
      photos: {
        orderBy: { sort_order: 'asc' }
      }
    }
  })

  if (!album) notFound()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/galleries">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{album.title}</h1>
            <Badge 
              variant={album.status === 'PUBLISHED' ? 'default' : album.status === 'DRAFT' ? 'secondary' : 'outline'}
              className={album.status === 'PUBLISHED' ? 'bg-green-500' : ''}
            >
              {album.status}
            </Badge>
          </div>
          {album.description && (
            <p className="text-muted-foreground mt-2 max-w-3xl">{album.description}</p>
          )}
        </div>
        <Link href={`/dashboard/galleries/${album.id}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Info
          </Button>
        </Link>
      </div>

      <div className="border-t pt-6 mt-6">
        <PhotoGrid 
          albumId={album.id} 
          photos={album.photos} 
          coverImageUrl={album.cover_image_url} 
        />
      </div>
    </div>
  )
}
