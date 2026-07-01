import { prisma } from '@/shared/api/prisma/client'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { KeyRoundIcon } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { ImportAccountsModal } from '@/features/commissariat-accounts/ui/ImportAccountsModal'
import { CreateAccountModal } from '@/features/commissariat-accounts/ui/CreateAccountModal'
import { CommissariatAccountTable } from '@/features/commissariat-accounts/ui/CommissariatAccountTable'

export const metadata = {
  title: 'Komisariat & LPP - HMI Cabang Semarang',
}

export default async function CommissariatAccountsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  const rows = await prisma.user.findMany({
    where: { role: 'ADMIN_KOMISARIAT' },
    orderBy: { created_at: 'desc' },
    include: { commissariat: { select: { name: true } } },
  })

  const accounts = rows.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    commissariat_name: u.commissariat?.name ?? null,
    last_login_at: u.last_login_at,
  }))

  const commissariats = await prisma.commissariat.findMany({
    where: { is_active: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="w-full space-y-6 p-6">
      <PageHeader
        title="Komisariat & LPP"
        description="Kelola akun login komisariat dan Lembaga Pengembangan Profesi (LPP). Buat akun massal via impor Excel."
        icon={KeyRoundIcon}
      >
        <CreateAccountModal commissariats={commissariats} />
        <ImportAccountsModal />
      </PageHeader>

      <CommissariatAccountTable accounts={accounts} />
    </div>
  )
}
