import { prisma } from '@/shared/api/prisma/client'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { TaxonomyTable } from '@/features/taxonomy/ui/TaxonomyTable'
import { CreateTaxonomyModal } from '@/features/taxonomy/ui/CreateTaxonomyModal'
import { ImportUniversitiesModal } from '@/features/taxonomy/ui/ImportUniversitiesModal'
import { GraduationCap } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'

export const metadata = {
  title: 'Manajemen Universitas - HMI Cabang Semarang',
}

export default async function UniversitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  const universities = await prisma.university.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="p-6 space-y-6 w-full">
      <PageHeader
        title="Manajemen Universitas"
        description="Daftar perguruan tinggi yang menaungi komisariat & pengurus. Universitas nonaktif tidak muncul di form baru, namun data lama tetap utuh."
        icon={GraduationCap}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Daftar Universitas / Perguruan Tinggi</h2>
        <div className="flex gap-2">
          <ImportUniversitiesModal />
          <CreateTaxonomyModal type="UNIVERSITY" label="Universitas" />
        </div>
      </div>

      <TaxonomyTable items={universities} type="UNIVERSITY" label="Universitas" />
    </div>
  )
}
