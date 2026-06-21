import { prisma } from '@/shared/lib/prisma'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { AgendaList } from '@/features/agendas/ui/AgendaList'
import { Button } from '@/shared/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { Prisma } from '@prisma/client'



import { PageHeader } from '@/shared/ui/page-header'
import { CalendarRange } from 'lucide-react'

export default async function AgendasPage() {
  const session = await getUserSession()
  
  if (!session) {
    redirect('/login')
  }

  const whereClause: Prisma.AgendaWhereInput = session.user.role === 'ADMIN_KOMISARIAT' 
    ? { commissariat_id: session.user.commissariatId || undefined, deleted_at: null }
    : { deleted_at: null }

  const agendas = await prisma.agenda.findMany({
    where: whereClause,
    orderBy: {
      start_datetime: 'desc',
    },
  })

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Manajemen Agenda" 
        description="Kelola jadwal kegiatan dan aktivitas acara."
        icon={CalendarRange}
      >
        <Link href="/dashboard/agendas/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Buat Agenda
          </Button>
        </Link>
      </PageHeader>

      <AgendaList agendas={agendas} />
    </div>
  )
}
