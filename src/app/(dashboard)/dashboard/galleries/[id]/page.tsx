import { prisma } from '@/shared/api/prisma/client'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PhotoGrid } from '@/features/galleries/ui/PhotoGrid'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Edit } from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/shared/ui/PageHeader'

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
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span>{album.title}</span>
            <Badge 
              variant={album.status === 'PUBLISHED' ? 'default' : album.status === 'DRAFT' ? 'secondary' : 'outline'}
              className={album.status === 'PUBLISHED' ? 'bg-green-500 hover:bg-green-500 text-white border-transparent' : ''}
            >
              {album.status}
            </Badge>
          </div>
        }
        description={album.description || undefined}
        backHref="/dashboard/galleries"
      >
        <Link href={`/dashboard/galleries/${album.id}/edit`} prefetch>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Info
          </Button>
        </Link>
      </PageHeader>

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
