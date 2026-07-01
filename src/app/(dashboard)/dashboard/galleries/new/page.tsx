import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { AlbumForm } from '@/features/galleries/ui/AlbumForm'

export default async function NewAlbumPage() {
  const session = await getUserSession()
  
  if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <AlbumForm />
    </div>
  )
}
