import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Clock, Eye, Newspaper } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/Breadcrumb'
import {
  getArticleBySlug,
  getRelatedArticles,
  incrementArticleView,
} from '@/features/articles/api/public-queries'
import { ArticleCard } from '@/features/articles/ui/ArticleCard'
import { ShareButtons } from '@/features/articles/ui/ShareButtons'
import { ReadingProgressBar } from '@/features/articles/ui/ReadingProgressBar'
import { SITE_URL } from '@/widgets/public-layout/config/site'

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const a = await getArticleBySlug(slug)
  if (!a) return { title: 'Artikel' }
  return {
    title: a.title,
    description: a.excerpt ?? undefined,
    openGraph: a.featured_image_url ? { images: [a.featured_image_url] } : undefined,
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  // ponytail: dihitung tiap render (termasuk prefetch/bot). Cukup untuk sekarang.
  await incrementArticleView(article.id)

  const related = await getRelatedArticles(article.category?.name ?? null, article.id, 3)

  const canonical = `${SITE_URL}/artikel/${slug}`
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Artikel', item: `${SITE_URL}/artikel` },
        { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      image: article.featured_image_url ? [article.featured_image_url] : undefined,
      datePublished: article.published_at ?? undefined,
      author: { '@type': 'Person', name: article.author_name ?? 'Redaksi HMI' },
      publisher: { '@type': 'Organization', name: 'HMI Cabang Semarang' },
      mainEntityOfPage: canonical,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgressBar />

      <article className="mx-auto max-w-[720px] px-5 pb-16 pt-24">
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
                <Link href="/artikel">Artikel</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[200px] text-primary">{article.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <header className="mt-8">
          {article.category?.name && (
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-primary">
              {article.category.name}
            </span>
          )}
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {article.title}
          </h1>

          {/* Author + meta */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-y py-4">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-primary">
              {article.author_image_url ? (
                <Image src={article.author_image_url} alt={article.author_name ?? 'Penulis'} fill className="object-cover" sizes="40px" />
              ) : (
                (article.author_name ?? '?').charAt(0)
              )}
            </span>
            <div className="mr-auto">
              <p className="text-sm font-semibold text-foreground">{article.author_name ?? 'Anonim'}</p>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                {article.published_at && <span>{dateFmt.format(new Date(article.published_at))}</span>}
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.reading_time} min</span>
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{article.view_count}</span>
              </p>
            </div>
            <ShareButtons title={article.title} />
          </div>
        </header>

        {/* Cover */}
        {article.featured_image_url ? (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-emerald-950">
            <Image src={article.featured_image_url} alt={article.title} fill className="object-cover" sizes="720px" priority />
          </div>
        ) : (
          <div className="mt-8 flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-emerald-950 text-white/30">
            <Newspaper className="h-12 w-12" />
          </div>
        )}

        {/* Konten */}
        <div
          className="prose prose-lg prose-emerald mt-10 max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Share bawah */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t pt-8 text-center">
          <p className="text-sm font-semibold text-foreground">Bagikan artikel ini</p>
          <ShareButtons title={article.title} />
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t bg-muted/30 py-14">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-2xl font-bold text-foreground">Artikel Terkait</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
