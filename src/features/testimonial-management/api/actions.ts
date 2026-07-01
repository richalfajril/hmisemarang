'use server'

import { prisma } from '@/shared/api/prisma/client'
import { revalidatePath } from 'next/cache'
import { getUserSession } from '@/shared/api/supabase/server'
import { testimonialSchema } from '@/entities/testimonial/model/schema'
import { ActionState } from '@/shared/lib/action-state'
import { logAuditAction } from '@/shared/lib/audit-logger'

const ENTITY = 'Testimonial'

function canManage(role?: string) {
  return role === 'SYSTEM_ADMIN' || role === 'ADMIN_CABANG'
}

export async function saveTestimonialAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await getUserSession()
    if (!session || !canManage(session.user.role)) {
      return { success: false, message: 'Unauthorized.' }
    }

    const id = formData.get('id') as string | null
    const parsed = testimonialSchema.safeParse({
      name: formData.get('name'),
      title: formData.get('title'),
      quote: formData.get('quote'),
      photo_url: formData.get('photo_url'),
      featured: formData.get('featured') === 'on' || formData.get('featured') === 'true',
      is_published:
        formData.get('is_published') === 'on' || formData.get('is_published') === 'true',
      display_order: formData.get('display_order') ?? 0,
    })

    if (!parsed.success) {
      return {
        success: false,
        message: 'Mohon periksa kembali form anda.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    const data = parsed.data

    if (id) {
      const existing = await prisma.testimonial.findUnique({ where: { id } })
      if (!existing) return { success: false, message: 'Testimoni tidak ditemukan.' }

      await prisma.testimonial.update({
        where: { id },
        data: { ...data, updated_by: session.user.id },
      })
      await logAuditAction({
        actor_id: session.user.id,
        entity_type: ENTITY,
        entity_id: id,
        action: 'UPDATED',
        newData: { name: data.name },
      })
    } else {
      const created = await prisma.testimonial.create({
        data: { ...data, created_by: session.user.id, updated_by: session.user.id },
      })
      await logAuditAction({
        actor_id: session.user.id,
        entity_type: ENTITY,
        entity_id: created.id,
        action: 'CREATED',
        newData: { name: data.name },
      })
    }

    revalidatePath('/dashboard/testimonials')
    revalidatePath('/')
    return { success: true, message: 'Testimoni berhasil disimpan.' }
  } catch (error) {
    console.error('Save testimonial error:', error)
    return { success: false, message: 'Terjadi kesalahan sistem.' }
  }
}

export async function deleteTestimonialAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getUserSession()
    if (!session || !canManage(session.user.role)) {
      return { success: false, message: 'Unauthorized' }
    }
    await prisma.testimonial.delete({ where: { id } })
    await logAuditAction({
      actor_id: session.user.id,
      entity_type: ENTITY,
      entity_id: id,
      action: 'DELETED',
      newData: {},
    })
    revalidatePath('/dashboard/testimonials')
    revalidatePath('/')
    return { success: true, message: 'Testimoni berhasil dihapus.' }
  } catch (error) {
    console.error('Delete testimonial error:', error)
    return { success: false, message: 'Gagal menghapus testimoni.' }
  }
}

export async function togglePublishTestimonialAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getUserSession()
    if (!session || !canManage(session.user.role)) {
      return { success: false, message: 'Unauthorized' }
    }
    const existing = await prisma.testimonial.findUnique({ where: { id } })
    if (!existing) return { success: false, message: 'Testimoni tidak ditemukan.' }

    const next = !existing.is_published
    await prisma.testimonial.update({
      where: { id },
      data: { is_published: next, updated_by: session.user.id },
    })
    await logAuditAction({
      actor_id: session.user.id,
      entity_type: ENTITY,
      entity_id: id,
      action: next ? 'PUBLISHED' : 'ARCHIVED',
      newData: { is_published: next },
    })
    revalidatePath('/dashboard/testimonials')
    revalidatePath('/')
    return {
      success: true,
      message: next ? 'Testimoni dipublikasikan.' : 'Publikasi testimoni dibatalkan.',
    }
  } catch (error) {
    console.error('Toggle publish testimonial error:', error)
    return { success: false, message: 'Gagal mengubah status publikasi.' }
  }
}
