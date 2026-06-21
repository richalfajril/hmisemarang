import { prisma } from '@/shared/api/prisma/client'
import { Suspense } from 'react'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { ArticleForm } from '@/features/articles/ui/ArticleForm'
import { notFound, redirect } from 'next/navigation'
import { RevisionNotes } from '@/features/content-review/ui/RevisionNotes'



export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getUserSession()
  const { id } = await params
  
  if (!session) {
    redirect('/login')
  }

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      tags: true
    }
  })

  if (!article) {
    notFound()
  }

  // Permission check
  if (session.user.role === 'ADMIN_KOMISARIAT' && article.commissariat_id !== session.user.commissariatId) {
    redirect('/dashboard/articles')
  }

  const categories = await prisma.articleCategory.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <Suspense fallback={<div>Memuat Catatan...</div>}>
        <RevisionNotes entityId={id} entityType="ARTICLE" />
      </Suspense>
      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Memuat...</div>}>
        <ArticleForm initialData={article} categories={categories} />
      </Suspense>
    </div>
  )
}
