'use server'
import { prisma } from '@/shared/lib/prisma'

import { revalidatePath } from 'next/cache'
import { PrismaClient, ArticleStatus, AgendaStatus, ReviewAction } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { reviewSchema, ReviewEntityType, ReviewActionEnum } from './schema'
import { ActionState } from '@/shared/lib/action-state'
import { logAuditAction } from '@/shared/lib/audit-logger'



export async function processReviewAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await getUserSession()
    if (!session) {
      return { success: false, message: 'Unauthorized. Please login.' }
    }

    if (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG') {
      return { success: false, message: 'Hanya Admin Cabang yang berhak melakukan peninjauan.' }
    }

    const rawData = {
      entity_id: formData.get('entity_id') as string,
      entity_type: formData.get('entity_type') as string,
      action: formData.get('action') as string,
      note: formData.get('note') as string,
      row_count: formData.get('row_count') || undefined,
    }

    const validatedFields = reviewSchema.safeParse(rawData)

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Gagal memvalidasi form review.',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { entity_id, entity_type, action, note, row_count } = validatedFields.data

    // Gunakan Prisma Atomic Transaction
    const result = await prisma.$transaction(async (tx) => {
      let createdById: string | undefined
      let entityTitle = ''

      // 1. Mutasi Status Entitas Induk
      if (entity_type === 'ARTICLE') {
        const article = await tx.article.findUnique({ where: { id: entity_id } })
        if (!article) throw new Error('Artikel tidak ditemukan.')
        if (article.status !== 'SUBMITTED') throw new Error('Artikel tidak dalam status SUBMITTED.')

        createdById = article.created_by
        entityTitle = article.title

        let nextStatus: ArticleStatus = ArticleStatus.DRAFT
        if (action === 'APPROVED') nextStatus = ArticleStatus.PUBLISHED
        else if (action === 'REVISION') nextStatus = ArticleStatus.REVISION
        else if (action === 'REJECTED') nextStatus = ArticleStatus.DRAFT

        await tx.article.update({
          where: { id: entity_id },
          data: {
            status: nextStatus,
            approved_at: action === 'APPROVED' ? new Date() : null,
            approved_by: action === 'APPROVED' ? session.user.id : null,
            updated_by: session.user.id,
          }
        })
      } else if (entity_type === 'AGENDA') {
        const agenda = await tx.agenda.findUnique({ where: { id: entity_id } })
        if (!agenda) throw new Error('Agenda tidak ditemukan.')
        if (agenda.status !== 'SUBMITTED') throw new Error('Agenda tidak dalam status SUBMITTED.')

        createdById = agenda.created_by
        entityTitle = agenda.title

        let nextStatus: AgendaStatus = AgendaStatus.DRAFT
        if (action === 'APPROVED') nextStatus = AgendaStatus.PUBLISHED
        else if (action === 'REVISION') nextStatus = AgendaStatus.REVISION
        else if (action === 'REJECTED') nextStatus = AgendaStatus.DRAFT

        await tx.agenda.update({
          where: { id: entity_id },
          data: {
            status: nextStatus,
            approved_at: action === 'APPROVED' ? new Date() : null,
            approved_by: action === 'APPROVED' ? session.user.id : null,
            updated_by: session.user.id,
          }
        })
      } else if (entity_type === 'COMMISSARIAT_PROFILE') {
        const sub = await tx.commissariatProfileSubmission.findUnique({ where: { id: entity_id }, include: { commissariat: true } })
        if (!sub) throw new Error('Pengajuan Profil tidak ditemukan.')
        if (sub.status !== 'SUBMITTED') throw new Error('Pengajuan tidak dalam status SUBMITTED.')

        createdById = sub.created_by
        entityTitle = `Profil: ${sub.commissariat.name}`

        let nextStatus: 'PUBLISHED' | 'APPROVED' | 'REJECTED' | 'DRAFT' = 'DRAFT'
        if (action === 'APPROVED') nextStatus = 'APPROVED'
        else if (action === 'REVISION') nextStatus = 'REJECTED' // Tidak ada status REVISION khusus, kita pakai REJECTED/DRAFT
        else if (action === 'REJECTED') nextStatus = 'REJECTED'

        await tx.commissariatProfileSubmission.update({
          where: { id: entity_id },
          data: {
            status: nextStatus,
            approved_at: action === 'APPROVED' ? new Date() : null,
            approved_by: action === 'APPROVED' ? session.user.id : null,
            updated_by: session.user.id,
          }
        })

        // Copy over to original commissariat if approved
        if (action === 'APPROVED') {
          await tx.commissariat.update({
            where: { id: sub.commissariat_id },
            data: {
              name: sub.name || undefined,
              logo_url: sub.logo_url || undefined,
              campus_name: sub.campus_name || undefined,
              about: sub.about || undefined,
              chairman_name: sub.chairman_name || undefined,
              chairman_about: sub.chairman_about || undefined,
              secretariat_photo_url: sub.secretariat_photo_url || undefined,
              map_url: sub.map_url || undefined,
              instagram_url: sub.instagram_url || undefined,
              address: sub.address || undefined,
              updated_at: new Date()
            }
          })
        }
      } else if (entity_type === 'CADRE_VERIFICATION') {
        const cv = await tx.cadreVerification.findUnique({ where: { id: entity_id }, include: { commissariat: true } })
        if (!cv) throw new Error('Pengajuan Verifikasi tidak ditemukan.')
        if (cv.status !== 'PENDING') throw new Error('Verifikasi tidak dalam status PENDING.')

        let createdById = 'SYSTEM' // Fallback
        const commissariatAdmins = await tx.user.findMany({ where: { commissariat_id: cv.commissariat_id, role: 'ADMIN_KOMISARIAT' } })
        if (commissariatAdmins.length > 0) createdById = commissariatAdmins[0].id
        
        entityTitle = `Verifikasi Kader: ${cv.commissariat.name}`

        let nextStatus: 'VERIFIED' | 'REJECTED' | 'PENDING' = 'REJECTED'
        if (action === 'APPROVED') nextStatus = 'VERIFIED'

        await tx.cadreVerification.update({
          where: { id: entity_id },
          data: {
            status: nextStatus,
            row_count: action === 'APPROVED' ? row_count : null,
            verified_at: action === 'APPROVED' ? new Date() : null,
            verified_by: action === 'APPROVED' ? session.user.id : null,
            note: note || null, // Capture note directly on the verification entity as well
          }
        })
      } else {
        throw new Error(`Entitas ${entity_type} belum didukung di MVP ini.`)
      }

      // 2. Rekam Review History
      const reviewHistoryAction: ReviewAction = action === 'APPROVED' ? 'APPROVED' : (action === 'REJECTED' ? 'REJECTED' : 'REVISION_REQUESTED')
      
      await tx.reviewHistory.create({
        data: {
          entity_type,
          entity_id,
          reviewer_id: session.user.id,
          action: reviewHistoryAction,
          note: note || null,
        }
      })

      // 3. Terbitkan Notifikasi ke Pembuat
      if (createdById) {
        let notifTitle = ''
        let notifMessage = ''
        
        if (action === 'APPROVED') {
          notifTitle = `✅ Disetujui: ${entityTitle}`
          notifMessage = `${entity_type === 'ARTICLE' ? 'Artikel' : 'Agenda'} Anda telah disetujui dan kini berstatus Publik.`
        } else if (action === 'REVISION') {
          notifTitle = `⚠️ Revisi Diminta: ${entityTitle}`
          notifMessage = `Cabang meminta perbaikan: "${note}". Silakan perbaiki dan ajukan ulang.`
        } else {
          notifTitle = `❌ Ditolak: ${entityTitle}`
          notifMessage = `Pengajuan Anda ditolak oleh Cabang: "${note}".`
        }

        await tx.notification.create({
          data: {
            user_id: createdById,
            title: notifTitle,
            message: notifMessage,
            type: 'REVIEW_RESULT',
            link_url: entity_type === 'ARTICLE' ? `/dashboard/articles/${entity_id}/edit` : `/dashboard/agendas/${entity_id}/edit`,
          }
        })
      }

      return { title: entityTitle }
    })

    // 4. Rekam Audit Log (di luar transaction aman, karena audit non-critical path)
    await logAuditAction({
      actor_id: session.user.id,
      entity_type: entity_type,
      entity_id: entity_id,
      action: action === 'APPROVED' ? 'PUBLISHED' : 'UPDATED',
      newData: { review_action: action, note }
    })

    revalidatePath('/dashboard/review-center')
    revalidatePath('/dashboard/articles')
    revalidatePath('/dashboard/agendas')

    return { success: true, message: `Review untuk "${result.title}" berhasil diproses.` }

  } catch (error: unknown) {
    console.error('Process review action error:', error)
    return { success: false, message: (error as Error).message || 'Terjadi kesalahan sistem saat memproses tinjauan.' }
  }
}
