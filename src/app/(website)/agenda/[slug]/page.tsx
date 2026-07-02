import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Calendar, Clock, MapPin, ExternalLink, CalendarRange, ArrowLeft } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/Breadcrumb'
import { getAgendaBySlug, getAllPublicAgendas, AGENDA_FALLBACK } from '@/widgets/home/api/queries'
import {
  getAgendaStatus,
  getAgendaBadge,
  getCountdownLabel,
  formatAgendaDate,
} from '@/shared/lib/agenda'
import { AgendaGridCard } from '@/features/agendas/ui/AgendaGrid'
import { SITE_URL } from '@/widgets/public-layout/config/site'

const timeFmt = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' })

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const a = await getAgendaBySlug(slug)
  if (!a) return { title: 'Agenda' }
  return {
    title: a.title,
    description: a.short_description ?? undefined,
    openGraph: a.flyer_url ? { images: [a.flyer_url] } : undefined,
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agenda = await getAgendaBySlug(slug)
  if (!agenda) notFound()

  const start = new Date(agenda.start_datetime)
  const end = agenda.end_datetime ? new Date(agenda.end_datetime) : null
  const status = getAgendaStatus(start, end)
  const badge = getAgendaBadge(status)
  const countdown = getCountdownLabel(start)
  const done = status === 'done'

  const cms = await getAllPublicAgendas()
  const cmsSlugs = new Set(cms.map((a) => a.slug))
  const others = [...cms, ...AGENDA_FALLBACK.filter((f) => !cmsSlugs.has(f.slug))]
    .filter((a) => a.slug !== agenda.slug)
    .slice(0, 4)

  const canonical = `${SITE_URL}/agenda/${slug}`
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Agenda', item: `${SITE_URL}/agenda` },
        { '@type': 'ListItem', position: 3, name: agenda.title, item: canonical },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: agenda.title,
      startDate: start.toISOString(),
      endDate: end ? end.toISOString() : undefined,
      eventStatus: 'https://schema.org/EventScheduled',
      image: agenda.flyer_url ? [agenda.flyer_url] : undefined,
      location: agenda.location_name
        ? { '@type': 'Place', name: agenda.location_name }
        : undefined,
      organizer: { '@type': 'Organization', name: 'HMI Cabang Semarang', url: SITE_URL },
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-5xl px-5 pb-16 pt-24">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Beranda</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/agenda">Agenda</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[200px] text-primary">{agenda.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header: flyer + info */}
        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* Flyer */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border bg-emerald-950 shadow-sm">
              {agenda.flyer_url ? (
                <Image src={agenda.flyer_url} alt={agenda.title} fill className="object-cover" sizes="(min-width:1024px) 40vw, 100vw" priority />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/25">
                  <CalendarRange className="h-14 w-14" />
                </div>
              )}
              <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${done ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
                {badge}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-3">
            {agenda.commissariat?.name && (
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-primary">
                {agenda.commissariat.name}
              </span>
            )}
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {agenda.title}
            </h1>
            {agenda.short_description && (
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{agenda.short_description}</p>
            )}

            <div className="mt-6 space-y-3 rounded-2xl border bg-muted/30 p-5">
              <p className="flex items-start gap-3 text-sm">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="font-medium text-foreground">{formatAgendaDate(start, end)}</span>
              </p>
              <p className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                {timeFmt.format(start)}{end ? ` – ${timeFmt.format(end)}` : ''} WIB
              </p>
              {agenda.location_name && (
                <p className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{agenda.location_name}</span>
                </p>
              )}
              {countdown && (
                <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  <Clock className="h-4 w-4" />
                  {countdown}
                </p>
              )}
            </div>

            {agenda.location_url && (
              <a
                href={agenda.location_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Lihat Lokasi <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Deskripsi */}
        <div
          className="prose prose-emerald mt-12 max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: agenda.description }}
        />

        <div className="mt-10 border-t pt-8">
          <Link href="/agenda" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Agenda
          </Link>
        </div>
      </div>

      {/* Agenda lainnya */}
      {others.length > 0 && (
        <section className="border-t bg-muted/30 py-14">
          <div className="mx-auto max-w-7xl px-5">
            <h2 className="text-2xl font-bold text-foreground">Agenda Lainnya</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((a) => (
                <AgendaGridCard key={a.id} agenda={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
