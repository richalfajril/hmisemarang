'use server'
import { prisma } from '@/shared/api/prisma/client'

import { revalidatePath } from 'next/cache'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { profileSubmissionSchema } from '@/entities/commissariat/model/profile-schema'
import { ActionState } from '@/shared/lib/action-state'
import { logAuditAction } from '@/shared/lib/audit-logger'



export async function saveProfileDraftAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await getUserSession()
    if (!session || !session.user.commissariatId) {
      return { success: false, message: 'Unauthorized. Hanya Admin Komisariat yang dapat mengubah profil.' }
    }

    const rawData = {
      name: formData.get('name') as string,
      campus_name: formData.get('campus_name') as string,
      about: formData.get('about') as string,
      chairman_name: formData.get('chairman_name') as string,
      chairman_about: formData.get('chairman_about') as string,
      address: formData.get('address') as string,
      map_url: formData.get('map_url') as string,
      instagram_url: formData.get('instagram_url') as string,
      logo_url: formData.get('logo_url') as string,
      secretariat_photo_url: formData.get('secretariat_photo_url') as string,
    }

    const validatedFields = profileSubmissionSchema.safeParse(rawData)

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Mohon periksa kembali form anda.',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const data = validatedFields.data
    const commissariatId = session.user.commissariatId

    // Cek apakah ada submission existing
    const existingSubmission = await prisma.commissariatProfileSubmission.findFirst({
      where: { commissariat_id: commissariatId },
      orderBy: { created_at: 'desc' }
    })

    if (existingSubmission && existingSubmission.status === 'SUBMITTED') {
      return { success: false, message: 'Tidak dapat menyimpan draf karena pengajuan sebelumnya sedang menunggu review.' }
    }

    if (existingSubmission && existingSubmission.status !== 'APPROVED') {
      // Update existing draft/rejected submission
      await prisma.commissariatProfileSubmission.update({
        where: { id: existingSubmission.id },
        data: {
          ...data,
          status: 'DRAFT',
          updated_by: session.user.id,
        }
      })

      await logAuditAction({
        actor_id: session.user.id,
        entity_type: 'CommissariatProfileSubmission',
        entity_id: existingSubmission.id,
        action: 'UPDATED',
        newData: { status: 'DRAFT' }
      })
    } else {
      // Create new submission
      const newSub = await prisma.commissariatProfileSubmission.create({
        data: {
          ...data,
          commissariat_id: commissariatId,
          status: 'DRAFT',
          created_by: session.user.id,
          updated_by: session.user.id,
        }
      })

      await logAuditAction({
        actor_id: session.user.id,
        entity_type: 'CommissariatProfileSubmission',
        entity_id: newSub.id,
        action: 'CREATED',
        newData: { status: 'DRAFT' }
      })
    }

    revalidatePath('/dashboard/profile')
    return { success: true, message: 'Draf profil berhasil disimpan.' }

  } catch (error: unknown) {
    console.error('Save profile draft error:', error)
    return { success: false, message: 'Terjadi kesalahan sistem saat menyimpan draf.' }
  }
}

export async function submitProfileAction(submissionId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getUserSession()
    if (!session || !session.user.commissariatId) {
      return { success: false, message: 'Unauthorized.' }
    }

    const existingSubmission = await prisma.commissariatProfileSubmission.findUnique({
      where: { id: submissionId }
    })

    if (!existingSubmission || existingSubmission.commissariat_id !== session.user.commissariatId) {
      return { success: false, message: 'Pengajuan tidak ditemukan atau akses ditolak.' }
    }

    if (existingSubmission.status === 'SUBMITTED') {
      return { success: false, message: 'Pengajuan sudah dalam antrean review.' }
    }

    await prisma.commissariatProfileSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'SUBMITTED',
        submitted_at: new Date(),
        updated_by: session.user.id,
      }
    })

    await logAuditAction({
      actor_id: session.user.id,
      entity_type: 'CommissariatProfileSubmission',
      entity_id: submissionId,
      action: 'UPDATED',
      newData: { status: 'SUBMITTED' }
    })

    revalidatePath('/dashboard/profile')
    return { success: true, message: 'Profil berhasil diajukan untuk ditinjau oleh Cabang.' }
  } catch (error: unknown) {
    console.error('Submit profile error:', error)
    return { success: false, message: 'Terjadi kesalahan sistem.' }
  }
}
