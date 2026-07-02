import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FeaturedCarousel } from '@/widgets/home/ui/FeaturedCarousel'
import type { PublicArticle } from '../api/public-queries'

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

function meta(a: PublicArticle) {
  const parts: string[] = []
  if (a.category?.name) parts.push(a.category.name)
  if (a.published_at) parts.push(dateFmt.format(new Date(a.published_at)))
  return parts.join(' • ')
}

function SecondaryCard({ article, tinted }: { article: PublicArticle; tinted?: boolean }) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group relative min-h-[18rem] flex-1 overflow-hidden rounded-3xl bg-emerald-900 transition-transform duration-300 hover:-translate-y-1"
    >
      {article.featured_image_url && (
        <Image
          src={article.featured_image_url}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      )}
      {tinted ? (
        <div className="absolute inset-0 bg-primary/80" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      )}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-200">{meta(article)}</p>
          <p className="mt-2 text-lg font-bold leading-snug text-white line-clamp-1">{article.title}</p>
          {article.excerpt && (
            <p className="mt-1.5 text-sm leading-relaxed text-white/85 line-clamp-2">{article.excerpt}</p>
          )}
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
            Baca Artikel <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function ArticleBento({ articles }: { articles: PublicArticle[] }) {
  const carousel = articles.slice(0, 3)
  const secondary = articles.slice(3, 5)
  if (carousel.length === 0) return null

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <FeaturedCarousel items={carousel} />
      </div>
      <div className="flex flex-col gap-6">
        {secondary.map((a, i) => (
          <SecondaryCard key={a.id} article={a} tinted={i === 0} />
        ))}
      </div>
    </div>
  )
}
