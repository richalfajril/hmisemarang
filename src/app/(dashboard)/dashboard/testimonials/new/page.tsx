import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { TestimonialForm } from '@/features/testimonial-management/ui/TestimonialForm'

export default async function NewTestimonialPage() {
  const session = await getUserSession()
  if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard')
  }

  return (
    <div className="w-full space-y-6 p-6">
      <TestimonialForm />
    </div>
  )
}
