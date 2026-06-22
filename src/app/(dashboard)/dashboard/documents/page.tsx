import { prisma } from '@/shared/api/prisma/client'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { DocumentList } from '@/features/documents/ui/DocumentList'
import { Button } from '@/shared/ui/Button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { ensureDocumentCategoriesExist } from '@/features/documents/api/actions'



import { PageHeader } from '@/shared/ui/PageHeader'
import { BookOpen } from 'lucide-react'

export default async function DocumentsPage() {
  const session = await getUserSession()
  
  if (!session) {
    redirect('/login')
  }

  // Cabang Only
  if (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG') {
    redirect('/dashboard')
  }

  // Auto-seed categories
  await ensureDocumentCategoriesExist()

  const documents = await prisma.document.findMany({
    where: { deleted_at: null },
    include: { category: true },
    orderBy: { created_at: 'desc' }
  })

  return (
    <div className="p-6 space-y-6 w-full">
      <PageHeader
        title="Manajemen Dokumen"
        description="Pusat penyimpanan berkas PDF organisasi untuk publik."
        icon={BookOpen}
      >
        <Link href="/dashboard/documents/new" prefetch>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Unggah Dokumen
          </Button>
        </Link>
      </PageHeader>

      <DocumentList documents={documents} />
    </div>
  )
}
