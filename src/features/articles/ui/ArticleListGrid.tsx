'use client'

import { ArticleCard } from './ArticleCard'
import { SmartPagination } from '@/shared/ui/SmartPagination'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import type { PublicArticle } from '../api/public-queries'

export function ArticleListGrid({ articles }: { articles: PublicArticle[] }) {
  const { paginatedData, currentPage, pageSize, totalItems, onPageChange, onPageSizeChange } =
    useClientPagination(articles, 10)

  if (articles.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">
        Belum ada artikel.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedData.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
      <SmartPagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
