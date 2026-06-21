import { prisma } from '@/shared/lib/prisma'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { PositionList } from '@/features/organization/ui/PositionList'
import { Button } from '@/shared/ui/ui/Button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-8">
      <div className="mb-8">
        <Button variant="ghost" className="-ml-4 mb-4">
          <Link href="/dashboard/organization/periods" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Periode
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Susunan Kepengurusan {period.start_year}-{period.end_year}
        </h1>
        <p className="text-muted-foreground mt-2">
          Tambahkan nama jabatan struktural lalu isi dengan anggota pengurus yang bersangkutan.
        </p>
      </div>

      <PositionList periodId={period.id} positions={period.positions} />
    </div>
  )
}
