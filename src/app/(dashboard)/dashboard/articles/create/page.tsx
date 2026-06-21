import { Suspense } from 'react'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { ArticleForm } from '@/features/articles/ui/ArticleForm'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function CreateArticlePage() {
  const session = await getUserSession()
  
  if (!session) {
    redirect('/login')
  }

  const categories = await prisma.articleCategory.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="p-6">
      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Memuat...</div>}>
        <ArticleForm categories={categories} />
      </Suspense>
    </div>
  )
}
