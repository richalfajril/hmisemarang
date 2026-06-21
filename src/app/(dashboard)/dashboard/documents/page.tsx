import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { DocumentList } from '@/features/documents/ui/DocumentList'
import { Button } from '@/shared/ui/ui/Button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { ensureDocumentCategoriesExist } from '@/features/documents/api/actions'

const prisma = new PrismaClient()

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
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Dokumen</h1>
          <p className="text-muted-foreground mt-2">
            Pusat penyimpanan berkas PDF organisasi untuk publik.
          </p>
        </div>
        <Link href="/dashboard/documents/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Unggah Dokumen
          </Button>
        </Link>
      </div>

      <DocumentList documents={documents} />
    </div>
  )
}
