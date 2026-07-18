import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getArticleBySlug,
  getRelatedArticles,
  incrementArticleView,
} from '@/features/articles/api/public-queries'
import { ArticleCard } from '@/features/articles/ui/ArticleCard'
import { ArticleReadingView } from '@/features/articles/ui/ArticleReadingView'
import { ReadingProgressBar } from '@/features/articles/ui/ReadingProgressBar'
import { SITE_URL } from '@/widgets/public-layout/config/site'

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

      <article className="mx-auto max-w-4xl px-5 pb-16 pt-24">
        <ArticleReadingView
          title={article.title}
          content={article.content}
          categoryName={article.category?.name}
          authorName={article.author_name}
          authorImageUrl={article.author_image_url}
          publishedAt={article.published_at}
          viewCount={article.view_count}
          featuredImageUrl={article.featured_image_url}
          featuredImageCaption={article.featured_image_caption}
          tags={article.tags}
        />
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
