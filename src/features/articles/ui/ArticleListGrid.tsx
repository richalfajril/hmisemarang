'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArticleCard } from './ArticleCard'
import { SmartPagination } from '@/shared/ui/SmartPagination'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import type { PublicArticle } from '../api/public-queries'

export function ArticleListGrid({ articles }: { articles: PublicArticle[] }) {
  const q = (useSearchParams().get('q') ?? '').trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return articles
    return articles.filter((a) =>
      [a.title, a.category?.name, a.author_name].some((v) => v?.toLowerCase().includes(q))
    )
  }, [articles, q])

  const { paginatedData, currentPage, pageSize, totalItems, onPageChange, onPageSizeChange } =
    useClientPagination(filtered, 9)

  if (filtered.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">
        {q ? 'Tidak ada artikel yang cocok.' : 'Belum ada artikel.'}
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
