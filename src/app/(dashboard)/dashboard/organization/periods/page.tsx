import { prisma } from '@/shared/api/prisma/client'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { PeriodList } from '@/features/organization/ui/PeriodList'
import { CreatePeriodModal } from '@/features/organization/ui/CreatePeriodModal'
import { Users2Icon } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'

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
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <PageHeader
        title="Riwayat Kepengurusan"
        description="Manajemen hierarki periode struktur organisasi HMI Cabang Semarang. Hanya ada satu periode yang tampil (Aktif) di Publik pada satu waktu."
        icon={Users2Icon}
      >
        <CreatePeriodModal />
      </PageHeader>

      <PeriodList items={periods} />
    </div>
  )
}
