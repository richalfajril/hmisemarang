import { prisma } from '@/shared/api/prisma/client'
import { Suspense } from 'react'
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

  const commissariats = await prisma.commissariat.findMany({
    where: { is_active: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  })

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-var(--header-height))] overflow-hidden">
      <Suspense fallback={<div className="p-6">Memuat Catatan...</div>}>
        <div className="px-6 pt-6 shrink-0">
          <RevisionNotes entityId={id} entityType="ARTICLE" />
        </div>
      </Suspense>
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Memuat...</div>}>
        <ArticleForm 
          initialData={article} 
          categories={categories}
          userRole={session.user.role}
          userCommissariatId={session.user.commissariatId || undefined}
          commissariats={commissariats}
        />
      </Suspense>
    </div>
  )
}
