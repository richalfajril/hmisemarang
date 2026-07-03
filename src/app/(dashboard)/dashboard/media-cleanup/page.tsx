import { prisma } from '@/shared/api/prisma/client'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { ScanSearchIcon } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { MediaCleanupPanel } from '@/features/media-cleanup/ui/MediaCleanupPanel'

export const metadata = { title: 'Media Cleanup - HMI Cabang Semarang' }

export default async function MediaCleanupPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  return (
    <div className="w-full space-y-6 p-6">
      <PageHeader
        title="Media Cleanup"
        description="Audit media Cloudinary yang tidak lagi terikat data (yatim) untuk menghemat penyimpanan."
        icon={ScanSearchIcon}
      />
      <MediaCleanupPanel />
    </div>
  )
}
