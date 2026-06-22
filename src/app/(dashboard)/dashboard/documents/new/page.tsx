import { prisma } from '@/shared/api/prisma/client'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { DocumentForm } from '@/features/documents/ui/DocumentForm'



export default async function NewDocumentPage() {
  const session = await getUserSession()
  
  if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  const categories = await prisma.documentCategory.findMany({
    where: { is_active: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-6 space-y-6 w-full">
      <DocumentForm categories={categories} />
    </div>
  )
}
