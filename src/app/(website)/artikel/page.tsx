import { Suspense } from 'react'
import { SectionHeaderLeft } from '@/shared/ui/SectionHeader'
import { PageHero } from '@/shared/ui/PageHero'
import { HeroSearchBox } from '@/shared/ui/HeroSearchBox'
import { FadeIn } from '@/shared/ui/FadeIn'
import {
  getLatestArticles,
  getPopularArticles,
  getAllPublicArticles,
  ARTICLE_FALLBACK,
  type PublicArticle,
} from '@/features/articles/api/public-queries'
import { ArticleBento } from '@/features/articles/ui/ArticleBento'
import { PopularCarousel } from '@/features/articles/ui/PopularCarousel'
import { ArticleListGrid } from '@/features/articles/ui/ArticleListGrid'

export const metadata = { title: 'Artikel', description: 'Kajian, opini, berita, dan gagasan dari kader HMI Cabang Semarang (HMI Semarang).' }
export const revalidate = 300

/** Ambang artikel asli: bila total < ini, pakai fallback biar terlihat ramai. */
const FALLBACK_THRESHOLD = 9

export default async function Page() {
  const [latest, popular, all] = await Promise.all([
    getLatestArticles(5),
    getPopularArticles(8),
    getAllPublicArticles(),
  ])

  // Fallback hanya saat data CMS masih sedikit (< 9). ≥ 9 → murni data asli.
  const useFallback = all.length < FALLBACK_THRESHOLD
  const mergeFb = (items: PublicArticle[]): PublicArticle[] => {
    if (!useFallback) return items
    const slugs = new Set(items.map((a) => a.slug))
    return [...items, ...ARTICLE_FALLBACK.filter((f) => !slugs.has(f.slug))]
  }

  const bentoItems = mergeFb(latest).slice(0, 5)
  const popularItems = mergeFb(popular).slice(0, 8)
  const listItems = mergeFb(all)

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Artikel' }]}
        eyebrow="Artikel"
        heading="Artikel & Gagasan"
        subheading="Kajian, opini, berita, dan gagasan dari kader HMI Cabang Semarang."
        align="left"
        action={
          <Suspense fallback={null}>
            <HeroSearchBox placeholder="Cari artikel..." />
          </Suspense>
        }
      />

      {/* Section 1 — Bento artikel terbaru */}
      <div className="mx-auto max-w-7xl px-5 pt-14">
        <FadeIn>
          <SectionHeaderLeft eyebrow="Terbaru" heading="Artikel Terbaru" />
        </FadeIn>
        <FadeIn delay={150} className="mt-8">
          <ArticleBento articles={bentoItems} />
        </FadeIn>
      </div>

      {/* Section 2 — Terpopuler (full-width, bg emerald + pola diamond) */}
      <section className="relative mt-20 overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 py-16">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="popular-geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 3 L57 30 L30 57 L3 30 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M30 15 L45 30 L30 45 L15 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#popular-geo)" />
        </svg>
        <div className="relative mx-auto max-w-7xl px-5">
          <FadeIn>
            <SectionHeaderLeft inverted eyebrow="Terpopuler" heading="Berita Paling Banyak Dibaca" />
          </FadeIn>
        </div>
        <FadeIn delay={150} className="mt-10">
          <PopularCarousel articles={popularItems} />
        </FadeIn>
      </section>

      {/* Section 3 — Daftar semua artikel (difilter oleh ?q= dari hero) */}
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-20">
        <FadeIn>
          <SectionHeaderLeft eyebrow="Jelajah" heading="Semua Artikel" />
        </FadeIn>
        <FadeIn delay={150} className="mt-8">
          <Suspense fallback={null}>
            <ArticleListGrid articles={listItems} />
          </Suspense>
        </FadeIn>
      </div>
    </div>
  )
}
