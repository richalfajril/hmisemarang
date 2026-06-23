import { prisma } from '@/shared/api/prisma/client'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { SusunanKepengurusan, type MemberItem } from '@/features/organization/ui/SusunanKepengurusan'
import { KelolaJabatanModal } from '@/features/organization/ui/KelolaJabatanModal'
import { TambahPengurusAction } from '@/features/organization/ui/TambahPengurusAction'
import { normalizeGroup } from '@/features/organization/ui/position-groups'
import type { SocialLink } from '@/features/organization/ui/social-config'
import { PageHeader } from '@/shared/ui/PageHeader'

export const metadata = {
  title: 'Susunan Pengurus - HMI Cabang Semarang',
}

function toSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((s): s is { platform?: unknown; url?: unknown } => !!s && typeof s === 'object')
    .filter((s) => typeof s.url === 'string' && (s.url as string).trim().length > 0)
    .map((s) => ({ platform: String(s.platform ?? 'website'), url: String(s.url) }))
}

export default async function PeriodDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  const [period, universities, commissariats] = await Promise.all([
    prisma.period.findUnique({
      where: { id },
      include: {
        positions: {
          orderBy: { sort_order: 'asc' },
          include: {
            members: {
              orderBy: { created_at: 'desc' },
              include: { university: true, commissariat: true },
            },
          },
        },
      },
    }),
    prisma.university.findMany({ where: { is_active: true }, orderBy: { name: 'asc' } }),
    prisma.commissariat.findMany({ where: { is_active: true }, orderBy: { name: 'asc' } }),
  ])

  if (!period) redirect('/dashboard/organization/periods')

  // Map members → MemberItem grouped by layout
  const ksb: MemberItem[] = []
  const kabid: MemberItem[] = []
  const lainnya: MemberItem[] = []

  for (const pos of period.positions) {
    const group = normalizeGroup(pos.layout_type)
    for (const m of pos.members) {
      const item: MemberItem = {
        id: m.id,
        full_name: m.full_name,
        photo_url: m.photo_url,
        short_bio: m.short_bio,
        social_links: toSocialLinks(m.social_links),
        positionName: pos.name,
        universityName: m.university?.name ?? null,
        commissariatName: m.commissariat?.name ?? null,
        position_id: m.position_id,
        university_id: m.university_id,
        commissariat_id: m.commissariat_id,
      }
      if (group === 'KSB') ksb.push(item)
      else if (group === 'KETUA_BIDANG') kabid.push(item)
      else lainnya.push(item)
    }
  }

  const positionOptions = period.positions.map((p) => ({ value: p.id, label: p.name }))
  const universityOptions = universities.map((u) => ({ value: u.id, label: u.name }))
  const commissariatOptions = commissariats.map((c) => ({ value: c.id, label: c.name }))
  const positionRows = period.positions.map((p) => ({
    id: p.id,
    name: p.name,
    layout_type: p.layout_type,
    memberCount: p.members.length,
  }))

  return (
    <div className="p-6 space-y-6 w-full">
      <PageHeader
        title={`Susunan Kepengurusan ${period.start_year}-${period.end_year}`}
        description="Tambahkan pengurus pada tiap jabatan. Kartu dapat diklik untuk membalik & melihat bio, kampus, dan komisariat."
        backHref="/dashboard/organization/periods"
        backLabel="Daftar Periode"
      >
        <KelolaJabatanModal periodId={period.id} positions={positionRows} />
        <TambahPengurusAction
          positions={positionOptions}
          universities={universityOptions}
          commissariats={commissariatOptions}
          disabled={positionOptions.length === 0}
        />
      </PageHeader>

      <SusunanKepengurusan
        ksb={ksb}
        kabid={kabid}
        lainnya={lainnya}
        positionOptions={positionOptions}
        universityOptions={universityOptions}
        commissariatOptions={commissariatOptions}
      />
    </div>
  )
}
