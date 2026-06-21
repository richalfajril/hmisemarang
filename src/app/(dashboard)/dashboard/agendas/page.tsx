import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { AgendaList } from '@/features/agendas/ui/AgendaList'
import { Button } from '@/shared/ui/ui/Button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { Prisma } from '@prisma/client'

const prisma = new PrismaClient()

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Agenda</h1>
          <p className="text-muted-foreground mt-2">
            Kelola jadwal kegiatan dan aktivitas acara.
          </p>
        </div>
        <Link href="/dashboard/agendas/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Buat Agenda
          </Button>
        </Link>
      </div>

      <AgendaList agendas={agendas} />
    </div>
  )
}
