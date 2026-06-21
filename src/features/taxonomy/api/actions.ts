'use server'
import { prisma } from '@/shared/lib/prisma'

import { z } from 'zod'
import { createClient } from '@/shared/api/supabase/server'
import { ActionState } from '@/shared/lib/action-state'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/shared/lib/utils'
import { logAuditAction } from '@/shared/lib/audit-logger'

const taxonomySchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(50, 'Maksimal 50 karakter'),
  type: z.enum(['ARTICLE_CATEGORY', 'DOCUMENT_CATEGORY', 'TAG'])
})

export async function createTaxonomyAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Belum masuk sistem.', errorCode: 'UNAUTHORIZED' }
  }

  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    return { success: false, message: 'Hanya cabang yang dapat membuat taksonomi baru.', errorCode: 'UNAUTHORIZED' }
  }

  const data = Object.fromEntries(formData.entries())
  const parsed = taxonomySchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      message: 'Kesalahan validasi form.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      errorCode: 'VALIDATION_ERROR',
    }
  }

  const { name, type } = parsed.data
  const slug = slugify(name)

  try {
    let entityId = ''

    if (type === 'ARTICLE_CATEGORY') {
      const exists = await prisma.articleCategory.findUnique({ where: { slug } })
      if (exists) return { success: false, message: 'Kategori artikel ini sudah ada.', errorCode: 'VALIDATION_ERROR' }
      const record = await prisma.articleCategory.create({ data: { name, slug } })
      entityId = record.id
    } 
    else if (type === 'DOCUMENT_CATEGORY') {
      const exists = await prisma.documentCategory.findUnique({ where: { slug } })
      if (exists) return { success: false, message: 'Kategori dokumen ini sudah ada.', errorCode: 'VALIDATION_ERROR' }
      const record = await prisma.documentCategory.create({ data: { name, slug } })
      entityId = record.id
    }
    else if (type === 'TAG') {
      const exists = await prisma.tag.findUnique({ where: { slug } })
      if (exists) return { success: false, message: 'Tag ini sudah ada.', errorCode: 'VALIDATION_ERROR' }
      const record = await prisma.tag.create({ data: { name, slug } })
      entityId = record.id
    }

    // Rekam log aktivitas
    await logAuditAction({
      actor_id: currentUser.id,
      entity_type: type,
      entity_id: entityId,
      action: 'CREATED',
      newData: { name, slug },
    })

    revalidatePath('/dashboard/taxonomy')

    return {
      success: true,
      message: `${name} berhasil ditambahkan.`,
    }
  } catch (error) {
    console.error('Create Taxonomy Error:', error)
    return { success: false, message: 'Gagal menyimpan ke basis data.', errorCode: 'SERVER_ERROR' }
  }
}

export async function toggleTaxonomyStatusAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, message: 'Belum masuk sistem.', errorCode: 'UNAUTHORIZED' }

  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }
  }

  const id = formData.get('id') as string
  const type = formData.get('type') as string
  const currentStatus = formData.get('currentStatus') === 'true'

  if (!id || !type) {
    return { success: false, message: 'Data tidak valid.', errorCode: 'VALIDATION_ERROR' }
  }

  try {
    const newStatus = !currentStatus

    if (type === 'ARTICLE_CATEGORY') {
      await prisma.articleCategory.update({ where: { id }, data: { is_active: newStatus } })
    } else if (type === 'DOCUMENT_CATEGORY') {
      await prisma.documentCategory.update({ where: { id }, data: { is_active: newStatus } })
    } else if (type === 'TAG') {
      await prisma.tag.update({ where: { id }, data: { is_active: newStatus } })
    }

    revalidatePath('/dashboard/taxonomy')
    return { success: true, message: `Status berhasil diubah menjadi ${newStatus ? 'Aktif' : 'Nonaktif'}.` }
  } catch (error) {
    return { success: false, message: 'Gagal mengubah status.', errorCode: 'SERVER_ERROR' }
  }
}
