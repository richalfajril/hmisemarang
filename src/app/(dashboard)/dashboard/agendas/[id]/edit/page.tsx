import { prisma } from '@/shared/api/prisma/client'
import { Suspense } from 'react'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { AgendaForm } from '@/features/agendas/ui/AgendaForm'
import { notFound, redirect } from 'next/navigation'
import { RevisionNotes } from '@/features/content-review/ui/RevisionNotes'



export default async function EditAgendaPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getUserSession()
  const { id } = await params
  
  if (!session) {
    redirect('/login')
  }

  const agenda = await prisma.agenda.findUnique({
    where: { id },
  })

  if (!agenda) {
    notFound()
  }

  if (session.user.role === 'ADMIN_KOMISARIAT' && agenda.commissariat_id !== session.user.commissariatId) {
    redirect('/dashboard/agendas')
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <Suspense fallback={<div>Memuat Catatan...</div>}>
        <RevisionNotes entityId={id} entityType="AGENDA" />
      </Suspense>
      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Memuat...</div>}>
        <AgendaForm initialData={agenda} />
      </Suspense>
    </div>
  )
}
