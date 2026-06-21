import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { prisma } from '@/shared/lib/prisma'
import { PeriodList } from '@/features/organization/ui/PeriodList'
import { CreatePeriodModal } from '@/features/organization/ui/CreatePeriodModal'
import { Users2Icon } from 'lucide-react'

export const metadata = {
  title: 'Riwayat Kepengurusan - HMI Cabang Semarang',
}

export default async function PeriodsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  const periods = await prisma.period.findMany({
    include: { _count: { select: { positions: true } } },
    orderBy: { start_year: 'desc' }
  })

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users2Icon className="h-8 w-8 text-muted-foreground" />
            Riwayat Kepengurusan
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Manajemen hierarki periode struktur organisasi HMI Cabang Semarang.
            Hanya ada satu periode yang tampil (Aktif) di Publik pada satu waktu.
          </p>
        </div>
        <CreatePeriodModal />
      </div>

      <PeriodList items={periods} />
    </div>
  )
}
