import Image from 'next/image'
import Link from 'next/link'
import { Clock, Eye, Newspaper } from 'lucide-react'
import type { PublicArticle } from '../api/public-queries'

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

export function ArticleCard({ article }: { article: PublicArticle }) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-emerald-950">
        {article.featured_image_url ? (
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/30">
            <Newspaper className="h-10 w-10" />
          </div>
        )}
        {article.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            {article.category.name}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-foreground line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {article.excerpt}
          </p>
        )}

        {/* Footer meta */}
        <div className="mt-4 flex items-center gap-2.5 border-t pt-4">
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-xs font-bold text-primary">
            {article.author_image_url ? (
              <Image src={article.author_image_url} alt={article.author_name ?? 'Penulis'} fill className="object-cover" sizes="28px" />
            ) : (
              (article.author_name ?? '?').charAt(0)
            )}
          </span>
          <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
            {article.author_name ?? 'Anonim'}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {article.reading_time}m
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" />
            {article.view_count}
          </span>
        </div>

        {article.published_at && (
          <p className="mt-2 text-[11px] text-muted-foreground/70">
            {dateFmt.format(new Date(article.published_at))}
          </p>
        )}
      </div>
    </Link>
  )
}
