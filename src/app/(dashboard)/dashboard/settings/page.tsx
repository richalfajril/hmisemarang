import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { prisma } from '@/shared/lib/prisma'
import { SettingsForm } from '@/features/website-settings/ui/SettingsForm'
import { Settings2Icon } from 'lucide-react'

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
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings2Icon className="h-8 w-8 text-muted-foreground" />
          Pengaturan Situs
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Konfigurasi identitas global HMI Cabang Semarang yang akan ditampilkan kepada publik, termasuk Metadata SEO dan tautan sosial media resmi.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <SettingsForm initialData={websiteSetting} />
      </div>
    </div>
  )
}
