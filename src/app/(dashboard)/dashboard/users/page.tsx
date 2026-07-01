import { prisma } from '@/shared/api/prisma/client'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { UserTable } from '@/features/user-management/ui/UserTable'
import { CreateUserModal } from '@/features/user-management/ui/CreateUserModal'
import { UsersIcon } from 'lucide-react'

import { PageHeader } from '@/shared/ui/PageHeader'

export const metadata = {
  title: 'Manajemen Pengguna - HMI Cabang Semarang',
}

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. Otorisasi
  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard') // Tolak akses jika bukan tingkat cabang
  }

  // 2. Ambil Data — modul ini khusus akun tingkat cabang (bukan komisariat/LPP)
  const rawUsers = await prisma.user.findMany({
    where: { role: { not: 'ADMIN_KOMISARIAT' } },
    orderBy: { role: 'asc' },
    include: { commissariat: { select: { name: true } } }
  })

  // Format data untuk dikirim ke Client Component agar serialization aman
  const formattedUsers = rawUsers.map(u => ({
    id: u.id,
    email: u.email,
    username: u.username,
    name: u.name,
    role: u.role,
    commissariat_name: u.commissariat?.name || null,
    last_login_at: u.last_login_at
  }))

  return (
    <div className="p-6 space-y-6 w-full">
      <PageHeader
        title="Manajemen Pengguna"
        description="Kelola akun pengurus tingkat cabang. Akun komisariat & LPP dikelola di modul terpisah."
        icon={UsersIcon}
      >
        <CreateUserModal />
      </PageHeader>

      <UserTable users={formattedUsers} currentUserId={currentUser.id} />
    </div>
  )
}
