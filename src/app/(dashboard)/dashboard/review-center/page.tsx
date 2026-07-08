import { prisma } from '@/shared/api/prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { ReviewQueue } from '@/features/content-review/ui/ReviewQueue'



import { PageHeader } from '@/shared/ui/PageHeader'
import { ClipboardCheck } from 'lucide-react'

export default async function ReviewCenterPage() {
  const session = await getUserSession()
  
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG') {
    redirect('/dashboard') // Komisariat tidak boleh masuk sini
  }

  // Fetch pending articles
  const articles = await prisma.article.findMany({
    where: { status: 'SUBMITTED', deleted_at: null },
    include: { commissariat: true },
    orderBy: { submitted_at: 'asc' },
  })

  // Fetch pending agendas
  const agendas = await prisma.agenda.findMany({
    where: { status: 'SUBMITTED', deleted_at: null },
    include: { commissariat: true },
    orderBy: { submitted_at: 'asc' },
  })

  // Fetch pending cadre verifications
  const verifications = await prisma.cadreVerification.findMany({
    where: { status: 'PENDING' },
    include: { commissariat: true },
    orderBy: { created_at: 'asc' },
  })

  return (
    <div className="p-6 space-y-6 w-full">
      <PageHeader
        title="Review Center"
        description="Pusat antrean persetujuan konten dari seluruh Komisariat."
        icon={ClipboardCheck}
      />

      <ReviewQueue
        articles={articles}
        agendas={agendas}
        verifications={verifications}
      />
    </div>
  )
}
