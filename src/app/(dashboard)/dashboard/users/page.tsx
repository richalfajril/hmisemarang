import { prisma } from '@/shared/lib/prisma'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { UserTable } from '@/features/user-management/ui/UserTable'
import { CreateUserModal } from '@/features/user-management/ui/CreateUserModal'
import { UsersIcon } from 'lucide-react'

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

  // 2. Ambil Data
  const rawUsers = await prisma.user.findMany({
    orderBy: { role: 'asc' },
    include: { commissariat: { select: { name: true } } }
  })

  const commissariats = await prisma.commissariat.findMany({
    where: { is_active: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })

  // Format data untuk dikirim ke Client Component agar serialization aman
  const formattedUsers = rawUsers.map(u => ({
    id: u.id,
    email: u.email,
    role: u.role,
    commissariat_name: u.commissariat?.name || null,
    last_login_at: u.last_login_at
  }))

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4 sm:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <UsersIcon className="h-8 w-8 text-muted-foreground" />
            Manajemen Pengguna
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Pusat kendali otoritas dan akses. Anda dapat menambahkan pengurus cabang baru atau membuka paksa kunci sandi akun komisariat.
          </p>
        </div>
        <CreateUserModal commissariats={commissariats} />
      </div>

      <UserTable users={formattedUsers} currentUserId={currentUser.id} />
    </div>
  )
}
