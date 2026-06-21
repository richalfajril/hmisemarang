import { prisma } from '@/shared/lib/prisma'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { ReviewQueue } from '@/features/content-review/ui/ReviewQueue'



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

  // Fetch pending profiles
  const profiles = await prisma.commissariatProfileSubmission.findMany({
    where: { status: 'SUBMITTED' },
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Center</h1>
        <p className="text-muted-foreground mt-2">
          Pusat antrean persetujuan konten dari seluruh Komisariat.
        </p>
      </div>

      <ReviewQueue 
        articles={articles} 
        agendas={agendas} 
        profiles={profiles}
        verifications={verifications}
      />
    </div>
  )
}
