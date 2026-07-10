'use server'
import { prisma } from '@/shared/api/prisma/client'

import { revalidatePath } from 'next/cache'
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
      university_id: formData.get('university_id') as string,
      about: formData.get('about') as string,
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

    // campus_name diturunkan dari nama universitas terpilih (untuk tampilan publik).
    const university = await prisma.university.findUnique({
      where: { id: validatedFields.data.university_id },
      select: { name: true },
    })
    const data = { ...validatedFields.data, campus_name: university?.name ?? null }
    const commissariatId = session.user.commissariatId

    // Langsung tulis ke entity Commissariat → tayang publik tanpa review Cabang.
    const updated = await prisma.commissariat.update({
      where: { id: commissariatId },
      data,
      select: { slug: true },
    })

    await logAuditAction({
      actor_id: session.user.id,
      entity_type: 'Commissariat',
      entity_id: commissariatId,
      action: 'UPDATED',
      newData: { name: data.name },
    })

    revalidatePath('/dashboard/profile')
    revalidatePath('/komisariat')
    revalidatePath(`/komisariat/${updated.slug}`)
    revalidatePath('/', 'layout')
    return { success: true, message: 'Profil berhasil disimpan & tayang.' }

  } catch (error: unknown) {
    console.error('Save profile error:', error)
    return { success: false, message: 'Terjadi kesalahan sistem saat menyimpan profil.' }
  }
}
