import { prisma } from '@/shared/api/prisma/client'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { SettingsForm } from '@/features/website-settings/ui/SettingsForm'
import { Settings2Icon } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'

export const metadata = {
  title: 'Pengaturan Situs - HMI Cabang Semarang',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Otorisasi: Hanya Cabang
  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  // Ambil data singleton
  const websiteSetting = await prisma.websiteSetting.findFirst()

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <PageHeader
        title="Pengaturan Situs"
        description="Konfigurasi identitas global HMI Cabang Semarang yang akan ditampilkan kepada publik, termasuk Metadata SEO dan tautan sosial media resmi."
        icon={Settings2Icon}
      />

      <div className="rounded-xl border bg-card p-6 shadow-xs max-w-4xl">
        <SettingsForm initialData={websiteSetting} />
      </div>
    </div>
  )
}
