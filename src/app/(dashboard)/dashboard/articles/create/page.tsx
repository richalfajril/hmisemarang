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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Memuat...</div>}>
        <ArticleForm categories={categories} />
      </Suspense>
    </div>
  )
}
