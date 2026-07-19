'use server'

import { prisma } from '@/shared/api/prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Persist the global org carousel header URL to the WebsiteSetting singleton.
 * The actual file upload reuses ImageUploader → uploadMediaAction → Cloudinary; this only stores
 * the returned secure_url so every admin shares one header (user decision: global, not per-admin).
 */
export async function saveCarouselHeaderAction(
  url: string,
): Promise<{ success: boolean; message?: string }> {
  const session = await getUserSession()
  if (!session) return { success: false, message: 'Belum masuk sistem.' }
  if (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG') {
    return { success: false, message: 'Akses ditolak.' }
  }
  if (!url || !/^https?:\/\//.test(url)) {
    return { success: false, message: 'URL header tidak valid.' }
  }

  try {
    const existing = await prisma.websiteSetting.findFirst()
    if (existing) {
      await prisma.websiteSetting.update({
        where: { id: existing.id },
        data: { carousel_header_url: url },
      })
    } else {
      await prisma.websiteSetting.create({
        data: { site_name: 'HMI Cabang Semarang', carousel_header_url: url },
      })
    }
    revalidatePath('/dashboard/articles')
    return { success: true }
  } catch (error) {
    console.error('Save carousel header error:', error)
    return { success: false, message: 'Gagal menyimpan header.' }
  }
}
