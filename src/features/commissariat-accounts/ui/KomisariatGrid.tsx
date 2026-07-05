'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, GraduationCap } from 'lucide-react'
import { SmartPagination } from '@/shared/ui/SmartPagination'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'

export type PublicCommissariat = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  campus_name: string | null
  cadre_count: number
  university: { name: string } | null
}

export function KomisariatGrid({ items }: { items: PublicCommissariat[] }) {
  const q = (useSearchParams().get('q') ?? '').trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return items
    return items.filter((c) =>
      [c.name, c.university?.name, c.campus_name].some((v) => v?.toLowerCase().includes(q))
    )
  }, [items, q])

  const { paginatedData, currentPage, pageSize, totalItems, onPageChange, onPageSizeChange } =
    useClientPagination(filtered, 9)

  if (filtered.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">
        {q ? 'Tidak ada komisariat yang cocok.' : 'Belum ada data komisariat.'}
      </p>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedData.map((c) => (
          <Link
            key={c.id}
            href={`/komisariat/${c.slug}`}
            className="group flex h-36 overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Foto / logo kiri */}
            <div className="relative w-28 shrink-0 overflow-hidden bg-white sm:w-36">
              {c.logo_url ? (
                <Image src={c.logo_url} alt={c.name} fill className="object-contain p-3" sizes="144px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-emerald-200">
                  <Building2 className="h-10 w-10" />
                </div>
              )}
            </div>

            {/* Info kanan */}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-5">
              <h3 className="font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary">
                {c.name}
              </h3>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4 shrink-0" />
                <span className="truncate">{c.university?.name ?? c.campus_name ?? '-'}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      <SmartPagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
