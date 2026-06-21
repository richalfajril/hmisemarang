import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { EmptyState } from '@/shared/ui/ui/EmptyState'
import { buttonVariants } from '@/shared/ui/ui/Button'

export default function ForbiddenPage() {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center p-4 bg-background">
      <EmptyState
        icon={<ShieldAlert className="h-12 w-12 text-destructive" />}
        title="Akses Ditolak (403)"
        description="Kredensial atau wewenang Anda tidak mencukupi untuk menembus portal ini. Silakan hubungi Administrator."
        action={
          <Link href="/dashboard" className={buttonVariants({ variant: 'default' })}>
            Kembali ke Dasbor
          </Link>
        }
      />
    </div>
  )
}
