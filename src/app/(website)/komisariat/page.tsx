import { PageHero } from '@/shared/ui/PageHero'
import { FadeIn } from '@/shared/ui/FadeIn'
import { getPublicCommissariats } from '@/widgets/home/api/queries'
import { KomisariatGrid } from '@/features/commissariat-accounts/ui/KomisariatGrid'

export const metadata = { title: 'Komisariat', description: 'Daftar komisariat HMI Cabang Semarang (HMI Semarang) di berbagai perguruan tinggi Kota Semarang.' }
export const revalidate = 300

export default async function Page() {
  const commissariats = await getPublicCommissariats()

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Komisariat' }]}
        eyebrow="Komisariat"
        heading="Komisariat HMI Cabang Semarang"
        subheading="Daftar komisariat yang bernaung di bawah HMI Cabang Semarang."
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14">
        <FadeIn>
          <KomisariatGrid items={commissariats} />
        </FadeIn>
      </div>
    </div>
  )
}
