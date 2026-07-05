'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/Select'

export type PeriodOption = { id: string; start_year: number; end_year: number }

function label(p: PeriodOption) {
  return `Periode ${p.start_year}-${p.end_year}`
}

/** Dropdown pilih periode → navigasi via ?period=. */
export function PeriodSelect({
  periods,
  selectedId,
}: {
  periods: PeriodOption[]
  selectedId: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Select
      value={selectedId}
      onValueChange={(id) => router.push(`${pathname}?period=${id}`)}
    >
      <SelectTrigger className="h-11 w-[220px] justify-between rounded-full border bg-white px-5 font-semibold shadow-sm">
        <SelectValue placeholder="Pilih periode" />
      </SelectTrigger>
      <SelectContent>
        {periods.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {label(p)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Tombol panah pindah periode. targetId null → disabled. */
export function PeriodArrow({
  targetId,
  direction,
}: {
  targetId: string | null
  direction: 'prev' | 'next'
}) {
  const router = useRouter()
  const pathname = usePathname()
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight

  return (
    <button
      type="button"
      disabled={!targetId}
      onClick={() => targetId && router.push(`${pathname}?period=${targetId}`)}
      aria-label={direction === 'prev' ? 'Periode sebelumnya' : 'Periode berikutnya'}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white text-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}
