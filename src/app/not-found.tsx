import Link from 'next/link'
import { MapPinOff } from 'lucide-react'
import { EmptyState } from '@/shared/ui/EmptyState'
import { buttonVariants } from '@/shared/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center p-4 bg-background">
      <EmptyState
        icon={<MapPinOff className="h-12 w-12 text-muted-foreground" />}
        title="Halaman Tidak Ditemukan (404)"
        description="Ruang digital yang Anda cari tampaknya tidak ada di koordinat ini, atau tautannya sudah kedaluwarsa."
        action={
          <Link href="/" prefetch className={buttonVariants({ variant: 'default' })}>
            Kembali ke Beranda
          </Link>
        }
      />
    </div>
  )
}
