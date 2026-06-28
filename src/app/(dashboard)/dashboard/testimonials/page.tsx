import { prisma } from '@/shared/api/prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Quote } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { PageHeader } from '@/shared/ui/PageHeader'
import { TestimonialList } from '@/features/testimonial-management/ui/TestimonialList'

export default async function TestimonialsPage() {
  const session = await getUserSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG') {
    redirect('/dashboard')
  }

  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ display_order: 'asc' }, { updated_at: 'desc' }],
    select: {
      id: true,
      name: true,
      title: true,
      photo_url: true,
      featured: true,
      is_published: true,
      display_order: true,
      updated_at: true,
    },
  })

  return (
    <div className="w-full space-y-6 p-6">
      <PageHeader
        title="Kata Mereka"
        description="Kelola kutipan tokoh, alumni, dan mitra yang tampil di halaman utama."
        icon={Quote}
      >
        <Link href="/dashboard/testimonials/new" prefetch>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Testimoni
          </Button>
        </Link>
      </PageHeader>

      <TestimonialList testimonials={testimonials} />
    </div>
  )
}
