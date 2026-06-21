import { prisma } from '@/shared/lib/prisma'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { AlbumForm } from '@/features/galleries/ui/AlbumForm'



export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getUserSession()
  const { id } = await params
  
  if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  const album = await prisma.galleryAlbum.findUnique({
    where: { id, deleted_at: null }
  })

  if (!album) notFound()

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <AlbumForm initialData={album} />
    </div>
  )
}
