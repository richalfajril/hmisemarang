'use server'
import { prisma } from '@/shared/api/prisma/client'

import { revalidatePath } from 'next/cache'
import { PrismaClient } from '@prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { cadreVerificationSchema } from '@/entities/commissariat/model/cadre-verification-schema'
import { ActionState } from '@/shared/lib/action-state'
import { logAuditAction } from '@/shared/lib/audit-logger'
import { uploadSecureFileToCloudinary } from '@/shared/lib/cloudinary'



export async function uploadCadreFileAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await getUserSession()
    if (!session || !session.user.commissariatId) {
      return { success: false, message: 'Unauthorized. Hanya Admin Komisariat yang dapat mengunggah file kader.' }
    }

    const file = formData.get('file') as File

    if (!file || file.size === 0) {
      return { success: false, message: 'Pilih file Excel terlebih dahulu.' }
    }

    const validatedFields = cadreVerificationSchema.safeParse({ file })

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Validasi file gagal.',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const commissariatId = session.user.commissariatId

    // Cek apakah ada submission PENDING
    const existingPending = await prisma.cadreVerification.findFirst({
      where: { 
        commissariat_id: commissariatId,
        status: 'PENDING'
      }
    })

    if (existingPending) {
      return { success: false, message: 'Anda sudah memiliki pengajuan yang sedang menunggu review Cabang.' }
    }

    // Unggah file ke Cloudinary secara aman (Secure URL)
    let uploadResult: { secure_url: string; public_id: string }
    try {
      uploadResult = await uploadSecureFileToCloudinary(file)
    } catch (uploadError) {
      console.error('Failed to upload secure file:', uploadError)
      return { success: false, message: 'Gagal mengunggah berkas ke server.' }
    }

    // Rekam ke database
    const newVerification = await prisma.cadreVerification.create({
      data: {
        commissariat_id: commissariatId,
        file_url: uploadResult.public_id, // Kita simpan public_id agar nanti bisa digenerate Signed URL nya
        status: 'PENDING'
      }
    })

    await logAuditAction({
      actor_id: session.user.id,
      entity_type: 'CadreVerification',
      entity_id: newVerification.id,
      action: 'CREATED',
      newData: { status: 'PENDING' }
    })

    revalidatePath('/dashboard/cadre-verification')
    return { success: true, message: 'Berkas verifikasi berhasil diunggah dan sedang menunggu peninjauan.' }

  } catch (error: unknown) {
    console.error('Upload cadre verification error:', error)
    return { success: false, message: 'Terjadi kesalahan sistem saat memproses berkas.' }
  }
}
