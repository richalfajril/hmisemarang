import { Construction } from 'lucide-react'
import { EmptyState } from '@/shared/ui/EmptyState'

/** Placeholder halaman publik yang belum dibangun (v1.9.0 berikutnya). */
export function ComingSoon({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12 md:pb-16">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      <div className="mt-8">
        <EmptyState
          icon={<Construction className="h-10 w-10 text-muted-foreground" />}
          title="Segera hadir"
          description={
            description ??
            `Halaman ${title} sedang dalam pengembangan dan akan tersedia pada rilis berikutnya.`
          }
        />
      </div>
    </div>
  )
}
