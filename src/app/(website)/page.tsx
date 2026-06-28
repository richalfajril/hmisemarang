import { Suspense } from 'react'
import { OpeningSplash } from '@/widgets/home/ui/OpeningSplash'
import { HomeHero } from '@/widgets/home/ui/HomeHero'
import { HomeAbout } from '@/widgets/home/ui/HomeAbout'
import { HomeArticles } from '@/widgets/home/ui/HomeArticles'
import { HomeAgenda } from '@/widgets/home/ui/HomeAgenda'
import { HomeGallery } from '@/widgets/home/ui/HomeGallery'
import { HomeCTA } from '@/widgets/home/ui/HomeCTA'
import { HomeTestimonials } from '@/widgets/home/ui/HomeTestimonials'
import {
  HeroSkeleton,
  AboutSkeleton,
  ArticlesSkeleton,
  AgendaSkeleton,
  GallerySkeleton,
  TestimonialsSkeleton,
} from '@/widgets/home/ui/HomeSkeletons'

export const revalidate = 300

export default function HomePage() {
  return (
    <>
      {/* Static: render langsung */}
      <OpeningSplash />

      {/* Dynamic: tiap section stream dengan skeleton (Loading State) */}
      <Suspense fallback={<HeroSkeleton />}>
        <HomeHero />
      </Suspense>
      <Suspense fallback={<AboutSkeleton />}>
        <HomeAbout />
      </Suspense>
      <Suspense fallback={<ArticlesSkeleton />}>
        <HomeArticles />
      </Suspense>
      <Suspense fallback={<AgendaSkeleton />}>
        <HomeAgenda />
      </Suspense>
      <Suspense fallback={<GallerySkeleton />}>
        <HomeGallery />
      </Suspense>

      {/* Static: render langsung */}
      <HomeCTA />

      <Suspense fallback={<TestimonialsSkeleton />}>
        <HomeTestimonials />
      </Suspense>
    </>
  )
}
