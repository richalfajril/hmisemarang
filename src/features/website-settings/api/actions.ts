'use server'

import { prisma } from '@/shared/api/prisma/client'
import { createClient } from '@/shared/api/supabase/server'
import { ActionState } from '@/shared/lib/action-state'
import { revalidatePath } from 'next/cache'
import { websiteSettingsSchema } from './schema'

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
          contact_phone: parsed.data.contact_phone || null,
          address: parsed.data.address || null,
          maps_embed_url: parsed.data.maps_embed_url || null,
          contact_image_url: parsed.data.contact_image_url || null,
          instagram_url: parsed.data.instagram_url || null,
          favicon_url: parsed.data.favicon_url || null,
          hero_image_url: parsed.data.hero_image_url || null,
          dark_logo_url: parsed.data.dark_logo_url || null,
          about_image_url: parsed.data.about_image_url || null,
        },
      })
    } else {
      await prisma.websiteSetting.create({
        data: {
          site_name: parsed.data.site_name,
          seo_description: parsed.data.seo_description || null,
          contact_email: parsed.data.contact_email || null,
          contact_phone: parsed.data.contact_phone || null,
          address: parsed.data.address || null,
          maps_embed_url: parsed.data.maps_embed_url || null,
          contact_image_url: parsed.data.contact_image_url || null,
          instagram_url: parsed.data.instagram_url || null,
          favicon_url: parsed.data.favicon_url || null,
          hero_image_url: parsed.data.hero_image_url || null,
          dark_logo_url: parsed.data.dark_logo_url || null,
          about_image_url: parsed.data.about_image_url || null,
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
