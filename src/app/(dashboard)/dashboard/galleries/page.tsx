import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { AlbumList } from '@/features/galleries/ui/AlbumList'
import { Button } from '@/shared/ui/ui/Button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function GalleriesPage() {
  const session = await getUserSession()
  
  if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  const albums = await prisma.galleryAlbum.findMany({
    where: { deleted_at: null },
    include: {
      _count: {
        select: { photos: true }
      }
    },
    orderBy: { created_at: 'desc' }
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Galeri</h1>
          <p className="text-muted-foreground mt-2">
            Pusat arsip dokumentasi visual kegiatan HMI Cabang Semarang.
          </p>
        </div>
        <Link href="/dashboard/galleries/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Buat Album Baru
          </Button>
        </Link>
      </div>

      <AlbumList albums={albums} />
    </div>
  )
}
