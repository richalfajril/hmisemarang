import { prisma } from '@/shared/lib/prisma'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { TaxonomyTabs } from '@/features/taxonomy/ui/TaxonomyTabs'
import { FolderTree } from 'lucide-react'

export const metadata = {
  title: 'Manajemen Taksonomi - HMI Cabang Semarang',
}

export default async function TaxonomyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Otorisasi: Hanya Cabang
  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  // Ambil Data Relasional & Hitung Penggunaan
  const [articleCategories, documentCategories, tags] = await Promise.all([
    prisma.articleCategory.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: 'asc' }
    }),
    prisma.documentCategory.findMany({
      include: { _count: { select: { documents: true } } },
      orderBy: { name: 'asc' }
    }),
    prisma.tag.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <FolderTree className="h-8 w-8 text-muted-foreground" />
          Manajemen Taksonomi
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Klasifikasikan seluruh data publikasi organisasi untuk mempermudah pencarian. 
          Kategori yang diarsipkan (Nonaktif) akan dihilangkan dari form penulisan baru, namun tidak merusak artikel lama.
        </p>
      </div>

      <TaxonomyTabs 
        articleCategories={articleCategories}
        documentCategories={documentCategories}
        tags={tags}
      />
    </div>
  )
}
