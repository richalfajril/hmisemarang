import { prisma } from '@/shared/api/prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { TestimonialForm } from '@/features/testimonial-management/ui/TestimonialForm'

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getUserSession()
  if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  const { id } = await params
  const t = await prisma.testimonial.findUnique({ where: { id } })
  if (!t) notFound()

  return (
    <div className="w-full space-y-6 p-6">
      <TestimonialForm
        initialData={{
          id: t.id,
          name: t.name,
          title: t.title,
          quote: t.quote,
          photo_url: t.photo_url,
          featured: t.featured,
          is_published: t.is_published,
          display_order: t.display_order,
        }}
      />
    </div>
  )
}
