import { prisma } from '@/shared/api/prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/features/commissariat-profile/ui/ProfileForm'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Button } from '@/shared/ui/Button'
import { Building2, Save } from 'lucide-react'

export default async function ProfilePage() {
  const session = await getUserSession()
  
  if (!session) {
    redirect('/login')
  }

  // Hanya Admin Komisariat yang boleh mengakses halaman ini
  if (session.user.role !== 'ADMIN_KOMISARIAT' || !session.user.commissariatId) {
    redirect('/dashboard')
  }

  const commissariatId = session.user.commissariatId

  // Profil langsung dari entity Commissariat (tanpa alur draft/review).
  const initialData = await prisma.commissariat.findUnique({
    where: { id: commissariatId },
  })

  // Ambil daftar universitas aktif untuk dropdown
  const universities = await prisma.university.findMany({
    where: { is_active: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-6 space-y-6 w-full">
      <PageHeader
        title="Profil Komisariat"
        description="Kelola informasi dan detail komisariat. Perubahan langsung tayang di halaman publik."
        icon={Building2}
      >
        <Button type="submit" form="profile-form">
          <Save className="mr-2 h-4 w-4" />
          Simpan
        </Button>
      </PageHeader>

      <ProfileForm initialData={initialData} universities={universities} />
    </div>
  )
}
