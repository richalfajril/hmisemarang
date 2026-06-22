import { prisma } from '@/shared/api/prisma/client'
import { Suspense } from 'react'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { ArticleForm } from '@/features/articles/ui/ArticleForm'
import { redirect } from 'next/navigation'



export default async function CreateArticlePage() {
  const session = await getUserSession()
  
  if (!session) {
    redirect('/login')
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
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Memuat...</div>}>
        <ArticleForm 
          categories={categories}
          userRole={session.user.role}
          userCommissariatId={session.user.commissariatId || undefined}
          commissariats={commissariats}
        />
      </Suspense>
    </div>
  )
}
