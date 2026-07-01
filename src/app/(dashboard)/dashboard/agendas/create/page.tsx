import { Suspense } from 'react'
import { getUserSession } from '@/shared/api/supabase/server'
import { AgendaForm } from '@/features/agendas/ui/AgendaForm'
import { redirect } from 'next/navigation'

export default async function CreateAgendaPage() {
  const session = await getUserSession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Memuat...</div>}>
        <AgendaForm />
      </Suspense>
    </div>
  )
}
