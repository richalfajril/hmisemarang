import Image from 'next/image'
import Link from 'next/link'
import { Clock, Eye, Newspaper } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/Breadcrumb'
import { ShareButtons } from '@/features/articles/ui/ShareButtons'

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

/** Estimasi waktu baca (menit) dari konten HTML. ~200 kata/menit. Sinkron dgn public-queries. */
function readingTimeMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export type ArticleReadingViewProps = {
  title: string
  content: string
  categoryName?: string | null
  authorName?: string | null
  authorImageUrl?: string | null
  publishedAt?: Date | string | null
  viewCount?: number
  featuredImageUrl?: string | null
  featuredImageCaption?: string | null
  tags?: string[]
  /** Breadcrumb Beranda › Artikel › judul. Default tampil. */
  showBreadcrumb?: boolean
}

/**
 * Tampilan baca artikel — dipakai halaman publik `/artikel/[slug]` dan pratinjau review
 * (ReviewSplitScreen) agar layout & desainnya identik dan tak drift.
 * Presentasional murni (tanpa 'use client'); aman di server & client tree.
 */
export function ArticleReadingView({
  title,
  content,
  categoryName,
  authorName,
  authorImageUrl,
  publishedAt,
  viewCount,
  featuredImageUrl,
  featuredImageCaption,
  tags = [],
  showBreadcrumb = true,
}: ArticleReadingViewProps) {
  // Dateline gaya berita: "SEMARANG, hmisemarang.org — " (bold, emerald) di awal paragraf pertama.
  const dateline = '<strong style="color:#047857">SEMARANG, hmisemarang.org</strong> — '
  const contentHtml = /<p[\s>]/i.test(content)
    ? content.replace(/<p(\s[^>]*)?>/i, (m) => m + dateline)
    : dateline + content
  const readingTime = readingTimeMinutes(content)

  return (
    <>
      {showBreadcrumb && (
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
              <BreadcrumbPage className="line-clamp-1 max-w-[200px] text-primary">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Header */}
      <header className="mt-8">
        {categoryName && (
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-primary">
            {categoryName}
          </span>
        )}
        <h1 className="mt-4 text-[1.75rem] font-bold leading-tight tracking-tight text-foreground sm:text-[2rem]">
          {title}
        </h1>

        {/* Author + meta */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-y py-4">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-primary">
            {authorImageUrl ? (
              <Image src={authorImageUrl} alt={authorName ?? 'Penulis'} fill className="object-cover" sizes="40px" />
            ) : (
              (authorName ?? '?').charAt(0)
            )}
          </span>
          <div className="mr-auto">
            <p className="text-sm font-semibold text-foreground">{authorName ?? 'Anonim'}</p>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              {publishedAt && <span>{dateFmt.format(new Date(publishedAt))}</span>}
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{readingTime} min</span>
              {typeof viewCount === 'number' && (
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{viewCount}</span>
              )}
            </p>
          </div>
          <ShareButtons title={title} collapsible />
        </div>
      </header>

      {/* Cover */}
      {featuredImageUrl ? (
        <figure className="mt-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-950">
            <Image src={featuredImageUrl} alt={featuredImageCaption || title} fill className="object-cover" sizes="896px" priority />
          </div>
          {featuredImageCaption && (
            <figcaption className="mt-2 text-center text-sm italic text-muted-foreground">{featuredImageCaption}</figcaption>
          )}
        </figure>
      ) : (
        <div className="mt-8 flex aspect-[16/9] w-full items-center justify-center bg-emerald-950 text-white/30">
          <Newspaper className="h-12 w-12" />
        </div>
      )}

      {/* Konten */}
      <div
        className="prose prose-lg prose-emerald mt-10 max-w-none prose-headings:font-bold prose-h2:text-2xl sm:prose-h2:text-[1.625rem] prose-h2:mt-0 prose-h2:mb-0 prose-h3:text-xl sm:prose-h3:text-[1.375rem] prose-h3:mt-0 prose-h3:mb-0 prose-a:text-primary prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Share bawah */}
      <div className="mt-10 flex flex-col items-center gap-3 border-t pt-8 text-center">
        <p className="text-sm font-semibold text-foreground">Bagikan artikel ini</p>
        <ShareButtons title={title} />
      </div>
    </>
  )
}
