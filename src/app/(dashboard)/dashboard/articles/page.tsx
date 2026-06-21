import { prisma } from '@/shared/lib/prisma'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { ArticleList } from '@/features/articles/ui/ArticleList'
import { Button } from '@/shared/ui/ui/Button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { Prisma } from '@prisma/client'



export default async function ArticlesPage() {
  const session = await getUserSession()
  
  if (!session) {
    redirect('/login')
  }

  // Admin Cabang sees all (or at least all not deleted)
  // Admin Komisariat sees only their own
  const whereClause: Prisma.ArticleWhereInput = session.user.role === 'ADMIN_KOMISARIAT' 
    ? { commissariat_id: session.user.commissariatId || undefined, deleted_at: null }
    : { deleted_at: null }

  const articles = await prisma.article.findMany({
    where: whereClause,
    include: {
      category: true,
      commissariat: true,
    },
    orderBy: {
      updated_at: 'desc',
    },
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Artikel</h1>
          <p className="text-muted-foreground mt-2">
            Kelola publikasi artikel berita, opini, dan kajian.
          </p>
        </div>
        <Link href="/dashboard/articles/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tulis Artikel
          </Button>
        </Link>
      </div>

      <ArticleList articles={articles} />
    </div>
  )
}
