import { prisma } from '@/shared/api/prisma/client'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/features/commissariat-profile/ui/ProfileForm'
import { RevisionNotes } from '@/features/content-review/ui/RevisionNotes'
import { Suspense } from 'react'



import { PageHeader } from '@/shared/ui/PageHeader'
import { Building2 } from 'lucide-react'

export default async function ProfilePage() {
  const session = await getUserSession()
  
  if (!session) {
    redirect('/login')
  }

  // Hanya Admin Komisariat yang boleh mengakses halaman ini
  if (session.user.role !== 'ADMIN_KOMISARIAT' || !session.user.commissariatId) {
    redirect('/dashboard')
  }

  const commissariatId = session.user.commissariatId

  // Ambil profil asli (Jika belum ada submission)
  const actualProfile = await prisma.commissariat.findUnique({
    where: { id: commissariatId }
  })

  // Ambil draf terbaru
  const latestSubmission = await prisma.commissariatProfileSubmission.findFirst({
    where: { commissariat_id: commissariatId },
    orderBy: { created_at: 'desc' }
  })

  // Data yang akan dipopulasikan ke dalam form
  // Prioritas: Draf/Revisi > Profil Asli
  const initialData = latestSubmission || actualProfile
  
  const status = latestSubmission ? latestSubmission.status : 'DRAFT'
  const submissionId = latestSubmission?.id

  return (
    <div className="p-6 space-y-6 w-full">
      <PageHeader
        title="Profil Komisariat"
        description="Kelola informasi dan detail kepengurusan. Perubahan memerlukan persetujuan Cabang."
        icon={Building2}
      />

      {latestSubmission?.id && (
        <Suspense fallback={<div>Memuat Catatan...</div>}>
          <RevisionNotes entityId={latestSubmission.id} entityType="COMMISSARIAT_PROFILE" />
        </Suspense>
      )}

      <ProfileForm 
        initialData={initialData} 
        submissionId={submissionId} 
        status={status} 
      />
    </div>
  )
}
