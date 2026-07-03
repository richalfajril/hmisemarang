import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { KeyRoundIcon } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { ChangePasswordForm } from '@/features/auth/ui/ChangePasswordForm'

export const metadata = { title: 'Ganti Password - HMI Cabang Semarang' }

export default async function ChangePasswordPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="w-full max-w-2xl space-y-6 p-6">
      <PageHeader
        title="Ganti Password"
        description="Perbarui kata sandi akun Anda. Gunakan kombinasi yang kuat dan mudah diingat."
        icon={KeyRoundIcon}
      />
      <ChangePasswordForm />
    </div>
  )
}
