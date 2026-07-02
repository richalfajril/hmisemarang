import { PageHero } from '@/shared/ui/PageHero'
import { FadeIn } from '@/shared/ui/FadeIn'
import { getAllPublicAgendas, AGENDA_FALLBACK } from '@/widgets/home/api/queries'
import { getAgendaStatus } from '@/shared/lib/agenda'
import { AgendaGrid } from '@/features/agendas/ui/AgendaGrid'

export const metadata = { title: 'Agenda', description: 'Jadwal kegiatan, acara, dan dokumentasi agenda HMI Cabang Semarang (HMI Semarang).' }
export const revalidate = 300

/** Ambang agenda asli: bila total < ini, pakai fallback biar terlihat ramai. */
const FALLBACK_THRESHOLD = 10

export default async function Page() {
  const cms = await getAllPublicAgendas()

  // Fallback hanya saat data CMS masih sedikit (< 10). ≥ 10 → murni data asli.
  const slugs = new Set(cms.map((a) => a.slug))
  const all =
    cms.length < FALLBACK_THRESHOLD
      ? [...cms, ...AGENDA_FALLBACK.filter((f) => !slugs.has(f.slug))]
      : cms

  const isDone = (a: (typeof all)[number]) =>
    getAgendaStatus(new Date(a.start_datetime), a.end_datetime ? new Date(a.end_datetime) : null) === 'done'

  // Upcoming/hari ini dulu (soonest first), lalu yang selesai (terbaru dulu).
  const upcoming = all.filter((a) => !isDone(a))
  const past = all.filter(isDone).reverse()
  const ordered = [...upcoming, ...past]

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Agenda' }]}
        eyebrow="Agenda"
        heading="Agenda & Kegiatan"
        subheading="Jadwal kegiatan, acara, dan dokumentasi agenda HMI Cabang Semarang."
      />

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-14">
        <FadeIn>
          <AgendaGrid items={ordered} />
        </FadeIn>
      </div>
    </div>
  )
}
