'use server'

import { revalidatePath } from 'next/cache'
import { PrismaClient, AgendaStatus } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { agendaSchema } from './schema'
import { ActionState } from '@/shared/lib/action-state'
import { logAuditAction } from '@/shared/lib/audit-logger'

const prisma = new PrismaClient()

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function saveAgendaDraftAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, message: 'Unauthorized. Please login.' }
    }

    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      flyer_url: formData.get('flyer_url') as string,
      description: formData.get('description') as string,
      short_description: formData.get('short_description') as string,
      start_datetime: formData.get('start_datetime') as string,
      end_datetime: formData.get('end_datetime') as string,
      location_name: formData.get('location_name') as string,
      location_url: formData.get('location_url') as string,
    }

    const validatedFields = agendaSchema.safeParse(rawData)

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Gagal memvalidasi form. Silakan periksa kembali isian Anda.',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const data = validatedFields.data
    const isEdit = !!formData.get('id')
    const agendaId = formData.get('id') as string
    
    const finalSlug = data.slug || generateSlug(data.title)

    // Check if slug already exists
    const existing = await prisma.agenda.findUnique({
      where: { slug: finalSlug },
    })

    if (existing && (!isEdit || existing.id !== agendaId)) {
      return { success: false, message: 'Slug/Judul sudah digunakan oleh agenda lain.' }
    }

    const startDt = new Date(data.start_datetime)
    const endDt = data.end_datetime ? new Date(data.end_datetime) : null

    if (isEdit) {
      const existingAgenda = await prisma.agenda.findUnique({
        where: { id: agendaId },
      })
      
      if (!existingAgenda) return { success: false, message: 'Agenda tidak ditemukan.' }
      
      if (session.user.role === 'ADMIN_KOMISARIAT' && existingAgenda.commissariat_id !== session.user.commissariatId) {
        return { success: false, message: 'Anda tidak memiliki hak akses mengubah agenda ini.' }
      }

      await prisma.agenda.update({
        where: { id: agendaId },
        data: {
          title: data.title,
          slug: finalSlug,
          flyer_url: data.flyer_url,
          description: data.description,
          short_description: data.short_description,
          start_datetime: startDt,
          end_datetime: endDt,
          location_name: data.location_name,
          location_url: data.location_url,
          updated_by: session.user.id,
        },
      })

      await logAuditAction({
        actor_id: session.user.id,
        entity_type: 'Agenda',
        entity_id: agendaId,
        action: 'UPDATED',
        newData: { title: data.title }
      })
    } else {
      await prisma.agenda.create({
        data: {
          commissariat_id: session.user.commissariatId,
          title: data.title,
          slug: finalSlug,
          flyer_url: data.flyer_url,
          description: data.description,
          short_description: data.short_description,
          start_datetime: startDt,
          end_datetime: endDt,
          location_name: data.location_name,
          location_url: data.location_url,
          status: AgendaStatus.DRAFT,
          created_by: session.user.id,
          updated_by: session.user.id,
        },
      })

      await logAuditAction({
        actor_id: session.user.id,
        entity_type: 'Agenda',
        entity_id: 'NEW',
        action: 'CREATED',
        newData: { title: data.title }
      })
    }

    revalidatePath('/dashboard/agendas')
    return { success: true, message: isEdit ? 'Draf agenda diperbarui.' : 'Draf agenda baru disimpan.' }

  } catch (error) {
    console.error('Save agenda draft error:', error)
    return { success: false, message: 'Terjadi kesalahan sistem saat menyimpan agenda.' }
  }
}

export async function submitAgendaAction(agendaId: string) {
  try {
    const session = await getUserSession()
    if (!session) throw new Error('Unauthorized')

    const existingAgenda = await prisma.agenda.findUnique({
      where: { id: agendaId },
    })
    
    if (!existingAgenda) throw new Error('Agenda tidak ditemukan')

    if (session.user.role === 'ADMIN_KOMISARIAT' && existingAgenda.commissariat_id !== session.user.commissariatId) {
      throw new Error('Unauthorized access')
    }

    await prisma.agenda.update({
      where: { id: agendaId },
      data: {
        status: AgendaStatus.SUBMITTED,
        submitted_at: new Date(),
        updated_by: session.user.id,
      },
    })

    await logAuditAction({
      actor_id: session.user.id,
      entity_type: 'Agenda',
      entity_id: agendaId,
      action: 'UPDATED',
      newData: { status: 'SUBMITTED' }
    })
    revalidatePath('/dashboard/agendas')
    return { success: true, message: 'Agenda berhasil diajukan untuk peninjauan.' }
  } catch (error: unknown) {
    console.error('Submit agenda error:', error)
    return { success: false, message: (error as Error).message || 'Terjadi kesalahan sistem.' }
  }
}

export async function softDeleteAgendaAction(agendaId: string) {
  try {
    const session = await getUserSession()
    if (!session) throw new Error('Unauthorized')

    const existingAgenda = await prisma.agenda.findUnique({
      where: { id: agendaId },
    })
    
    if (!existingAgenda) throw new Error('Agenda tidak ditemukan')

    if (session.user.role === 'ADMIN_KOMISARIAT' && existingAgenda.commissariat_id !== session.user.commissariatId) {
      throw new Error('Unauthorized access')
    }

    await prisma.agenda.update({
      where: { id: agendaId },
      data: {
        deleted_at: new Date(),
        deleted_by: session.user.id,
      },
    })

    await logAuditAction({
      actor_id: session.user.id,
      entity_type: 'Agenda',
      entity_id: agendaId,
      action: 'DELETED',
    })
    revalidatePath('/dashboard/agendas')
    return { success: true, message: 'Agenda berhasil dihapus sementara.' }
  } catch (error: unknown) {
    console.error('Soft delete agenda error:', error)
    return { success: false, message: (error as Error).message || 'Terjadi kesalahan sistem.' }
  }
}
