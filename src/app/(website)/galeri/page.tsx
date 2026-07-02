import { PageHero } from '@/shared/ui/PageHero'
import { FadeIn } from '@/shared/ui/FadeIn'
import { getPublicGalleryPhotos, getPublicAlbumCount, GALLERY_FALLBACK } from '@/widgets/home/api/queries'
import { GalleryBento } from '@/features/galleries/ui/GalleryBento'

export const metadata = { title: 'Galeri', description: 'Dokumentasi momen dan kegiatan HMI Cabang Semarang (HMI Semarang).' }
export const revalidate = 300

/** Ambang album asli: bila < ini, pakai fallback biar terlihat ramai. */
const FALLBACK_THRESHOLD = 6

export default async function Page() {
  const [cmsPhotos, albumCount] = await Promise.all([
    getPublicGalleryPhotos(),
    getPublicAlbumCount(),
  ])

  // Fallback hanya saat album CMS masih sedikit (< 6). ≥ 6 → murni data asli.
  const photos =
    albumCount < FALLBACK_THRESHOLD ? [...cmsPhotos, ...GALLERY_FALLBACK] : cmsPhotos

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Galeri' }]}
        eyebrow="Galeri"
        heading="Galeri Kegiatan"
        subheading="Dokumentasi momen dan kegiatan HMI Cabang Semarang. Seret untuk menjelajah, klik untuk memperbesar."
      />

      <div className="pb-16 pt-14">
        <FadeIn>
          <GalleryBento photos={photos} />
        </FadeIn>
      </div>
    </div>
  )
}
