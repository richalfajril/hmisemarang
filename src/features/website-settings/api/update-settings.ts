'use server'

import { z } from 'zod'
import { createClient } from '@/shared/api/supabase/server'
import { ActionState } from '@/shared/lib/action-state'
import { prisma } from '@/shared/lib/prisma'
import { revalidatePath } from 'next/cache'

const websiteSettingsSchema = z.object({
  site_name: z.string().min(1, 'Nama situs wajib diisi').max(100, 'Maksimal 100 karakter'),
  seo_description: z.string().max(255, 'Maksimal 255 karakter').optional().or(z.literal('')),
  contact_email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  instagram_url: z.string().url('Format URL tidak valid').optional().or(z.literal('')),
})

export async function updateSettingsAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Belum masuk sistem.', errorCode: 'UNAUTHORIZED' }
  }

  // Otorisasi: Hanya SYSTEM_ADMIN dan ADMIN_CABANG
  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }
  }

  const data = Object.fromEntries(formData.entries())
  
  // Transform empty strings to null for optional URL/Email validations
  const transformedData = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, v === '' ? undefined : v])
  )

  const parsed = websiteSettingsSchema.safeParse(transformedData)

  if (!parsed.success) {
    return {
      success: false,
      message: 'Kesalahan validasi data pengaturan.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      errorCode: 'VALIDATION_ERROR',
    }
  }

  try {
    // Upsert Singleton record (assuming ID "singleton" or using findFirst)
    const existing = await prisma.websiteSetting.findFirst()

    if (existing) {
      await prisma.websiteSetting.update({
        where: { id: existing.id },
        data: {
          site_name: parsed.data.site_name,
          seo_description: parsed.data.seo_description || null,
          contact_email: parsed.data.contact_email || null,
          address: parsed.data.address || null,
          instagram_url: parsed.data.instagram_url || null,
        },
      })
    } else {
      await prisma.websiteSetting.create({
        data: {
          site_name: parsed.data.site_name,
          seo_description: parsed.data.seo_description || null,
          contact_email: parsed.data.contact_email || null,
          address: parsed.data.address || null,
          instagram_url: parsed.data.instagram_url || null,
        },
      })
    }

    revalidatePath('/', 'layout') // Revalidate global layout
    revalidatePath('/dashboard/settings')

    return {
      success: true,
      message: 'Pengaturan situs berhasil diperbarui.',
    }
  } catch (error) {
    console.error('Update Settings Error:', error)
    return { success: false, message: 'Gagal menyimpan ke basis data.', errorCode: 'SERVER_ERROR' }
  }
}
