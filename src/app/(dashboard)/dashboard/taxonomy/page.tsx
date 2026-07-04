import { prisma } from '@/shared/api/prisma/client'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { TaxonomyTabs } from '@/features/taxonomy/ui/TaxonomyTabs'
import { FolderTree } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'

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
    <div className="p-6 space-y-6 w-full">
      <PageHeader
        title="Manajemen Taksonomi"
        description="Klasifikasikan seluruh data publikasi organisasi untuk mempermudah pencarian. Kategori yang diarsipkan (Nonaktif) akan dihilangkan dari form penulisan baru, namun tidak merusak artikel lama."
        icon={FolderTree}
      />

      <TaxonomyTabs
        articleCategories={articleCategories}
        documentCategories={documentCategories}
        tags={tags}
      />
    </div>
  )
}
