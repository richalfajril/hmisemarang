import { Building2, GraduationCap, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Props = {
  commissariatCount: number
  universityCount: number
  cadreCount: number
}

const formatNumber = (n: number) => new Intl.NumberFormat('id-ID').format(n)

export function HomeStats({ commissariatCount, universityCount, cadreCount }: Props) {
  const stats: { icon: LucideIcon; value: number; label: string }[] = [
    { icon: Building2, value: commissariatCount, label: 'Komisariat' },
    { icon: GraduationCap, value: universityCount, label: 'Kampus' },
    { icon: Users, value: cadreCount, label: 'Kader' },
  ]

  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-xl border bg-card p-8 text-center shadow-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </span>
              <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
                {formatNumber(value)}
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
