import { prisma } from '@/shared/lib/prisma'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { DocumentForm } from '@/features/documents/ui/DocumentForm'



export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getUserSession()
  const { id } = await params
  
  if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  const doc = await prisma.document.findUnique({
    where: { id, deleted_at: null }
  })

  if (!doc) notFound()

  const categories = await prisma.documentCategory.findMany({
    where: { is_active: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-6 max-w-4xl">
      <DocumentForm initialData={doc} categories={categories} />
    </div>
  )
}
