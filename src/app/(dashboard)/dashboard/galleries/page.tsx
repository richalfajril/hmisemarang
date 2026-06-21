import { prisma } from '@/shared/api/prisma/client'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { AlbumList } from '@/features/galleries/ui/AlbumList'
import { Button } from '@/shared/ui/Button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'



import { PageHeader } from '@/shared/ui/PageHeader'
import { Images } from 'lucide-react'

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
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <PageHeader
        title="Manajemen Galeri"
        description="Pusat arsip dokumentasi visual kegiatan HMI Cabang Semarang."
        icon={Images}
      >
        <Link href="/dashboard/galleries/new" prefetch>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Buat Album Baru
          </Button>
        </Link>
      </PageHeader>

      <AlbumList albums={albums} />
    </div>
  )
}
