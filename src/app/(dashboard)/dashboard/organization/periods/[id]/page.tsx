import { prisma } from '@/shared/api/prisma/client'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { PositionList } from '@/features/organization/ui/PositionList'
import { Button } from '@/shared/ui/Button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { PageHeader } from '@/shared/ui/PageHeader'

export const metadata = {
  title: 'Susunan Pengurus - HMI Cabang Semarang',
}

export default async function PeriodDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const period = await prisma.period.findUnique({
    where: { id },
    include: {
      positions: {
        orderBy: { sort_order: 'asc' },
        include: { members: { orderBy: { full_name: 'asc' } } }
      }
    }
  })

  if (!period) redirect('/dashboard/organization/periods')

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <PageHeader
        title={`Susunan Kepengurusan ${period.start_year}-${period.end_year}`}
        description="Tambahkan nama jabatan struktural lalu isi dengan anggota pengurus yang bersangkutan."
        backHref="/dashboard/organization/periods"
        backLabel="Daftar Periode"
      />

      <PositionList periodId={period.id} positions={period.positions} />
    </div>
  )
}
