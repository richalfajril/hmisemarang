'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowRight, CalendarRange } from 'lucide-react'
import {
  getAgendaStatus,
  getAgendaBadge,
  getCountdownLabel,
  formatAgendaDate,
} from '@/shared/lib/agenda'
import { SmartPagination } from '@/shared/ui/SmartPagination'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import type { AgendaItem } from '@/widgets/home/ui/AgendaCarousel'

export function AgendaGridCard({ agenda }: { agenda: AgendaItem }) {
  const start = new Date(agenda.start_datetime)
  const end = agenda.end_datetime ? new Date(agenda.end_datetime) : null
  const status = getAgendaStatus(start, end)
  const badge = getAgendaBadge(status)
  const countdown = getCountdownLabel(start)
  const done = status === 'done'

  return (
    <Link
      href={`/agenda/${agenda.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-emerald-950">
        {agenda.flyer_url ? (
          <Image
            src={agenda.flyer_url}
            alt={agenda.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/25">
            <CalendarRange className="h-12 w-12" />
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
            done ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
          }`}
        >
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-foreground line-clamp-2">{agenda.title}</h3>

        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-primary" />
            {formatAgendaDate(start, end)}
          </p>
          {agenda.location_name && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span className="line-clamp-1">{agenda.location_name}</span>
            </p>
          )}
        </div>

        {countdown && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <Clock className="h-4 w-4" />
            {countdown}
          </p>
        )}

        <span className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {done ? 'Lihat Dokumentasi' : 'Lihat Detail'}
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function AgendaGrid({ items }: { items: AgendaItem[] }) {
  const { paginatedData, currentPage, pageSize, totalItems, onPageChange, onPageSizeChange } =
    useClientPagination(items, 8)

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">
        Belum ada agenda.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {paginatedData.map((a) => (
          <AgendaGridCard key={a.id} agenda={a} />
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
