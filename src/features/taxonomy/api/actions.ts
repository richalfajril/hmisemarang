'use server'
import { prisma } from '@/shared/api/prisma/client'

import * as XLSX from 'xlsx'
import { z } from 'zod'
import { createClient } from '@/shared/api/supabase/server'
import { ActionState } from '@/shared/lib/action-state'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/shared/lib/utils'
import { pickField } from '@/shared/lib/xlsx-helpers'
import { logAuditAction } from '@/shared/lib/audit-logger'

const taxonomySchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(100, 'Maksimal 100 karakter'),
  type: z.enum(['ARTICLE_CATEGORY', 'DOCUMENT_CATEGORY', 'TAG', 'UNIVERSITY'])
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
    else if (type === 'UNIVERSITY') {
      const exists = await prisma.university.findUnique({ where: { slug } })
      if (exists) return { success: false, message: 'Universitas ini sudah ada.', errorCode: 'VALIDATION_ERROR' }
      const record = await prisma.university.create({ data: { name, slug } })
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
    revalidatePath('/dashboard/universities')

    return {
      success: true,
      message: `${name} berhasil ditambahkan.`,
    }
  } catch (_error) {
    console.error('Create Taxonomy Error:', _error)
    return { success: false, message: 'Gagal menyimpan ke basis data.', errorCode: 'SERVER_ERROR' }
  }
}

export async function updateTaxonomyAction(
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
    return { success: false, message: 'Hanya cabang yang dapat mengubah taksonomi.', errorCode: 'UNAUTHORIZED' }
  }

  const id = formData.get('id') as string
  const data = Object.fromEntries(formData.entries())
  const parsed = taxonomySchema.safeParse(data)

  if (!id) {
    return { success: false, message: 'Data tidak valid.', errorCode: 'VALIDATION_ERROR' }
  }

  if (!parsed.success) {
    return {
      success: false,
      message: 'Kesalahan validasi form.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      errorCode: 'VALIDATION_ERROR',
    }
  }

  const { name, type } = parsed.data

  try {
    // Slug sengaja dipertahankan agar tautan publik/SEO tidak putus.
    if (type === 'ARTICLE_CATEGORY') {
      await prisma.articleCategory.update({ where: { id }, data: { name } })
    } else if (type === 'DOCUMENT_CATEGORY') {
      await prisma.documentCategory.update({ where: { id }, data: { name } })
    } else if (type === 'TAG') {
      await prisma.tag.update({ where: { id }, data: { name } })
    } else if (type === 'UNIVERSITY') {
      await prisma.university.update({ where: { id }, data: { name } })
    }

    await logAuditAction({
      actor_id: currentUser.id,
      entity_type: type,
      entity_id: id,
      action: 'UPDATED',
      newData: { name },
    })

    revalidatePath('/dashboard/taxonomy')
    revalidatePath('/dashboard/universities')

    return { success: true, message: `${name} berhasil diperbarui.` }
  } catch (_error) {
    console.error('Update Taxonomy Error:', _error)
    return { success: false, message: 'Gagal memperbarui ke basis data.', errorCode: 'SERVER_ERROR' }
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
    } else if (type === 'UNIVERSITY') {
      await prisma.university.update({ where: { id }, data: { is_active: newStatus } })
    }

    revalidatePath('/dashboard/taxonomy')
    revalidatePath('/dashboard/universities')
    return { success: true, message: `Status berhasil diubah menjadi ${newStatus ? 'Aktif' : 'Nonaktif'}.` }
  } catch (_error) {
    return { success: false, message: 'Gagal mengubah status.', errorCode: 'SERVER_ERROR' }
  }
}

// IMPORT UNIVERSITAS (Excel) — kolom "Nama Kampus".
type UniversityImportResult = {
  created: number
  skipped: { row: number; name: string; reason: string }[]
}

export async function importUniversitiesAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState<UniversityImportResult>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Belum masuk sistem.', errorCode: 'UNAUTHORIZED' }
  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }
  }

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) {
    return { success: false, message: 'Berkas Excel wajib diunggah.', errorCode: 'VALIDATION_ERROR' }
  }

  let rows: Record<string, unknown>[]
  try {
    const buf = Buffer.from(await file.arrayBuffer())
    const wb = XLSX.read(buf, { type: 'buffer' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  } catch {
    return { success: false, message: 'Gagal membaca berkas Excel. Pastikan format .xlsx/.xls valid.', errorCode: 'SERVER_ERROR' }
  }
  if (rows.length === 0) {
    return { success: false, message: 'Berkas kosong / tidak ada baris data.', errorCode: 'VALIDATION_ERROR' }
  }

  // Preload slug yang sudah ada untuk dedup (nama unik lewat slug).
  const existingSlugs = new Set((await prisma.university.findMany({ select: { slug: true } })).map((u) => u.slug))
  const result: UniversityImportResult = { created: 0, skipped: [] }
  const seenInBatch = new Set<string>()

  for (let i = 0; i < rows.length; i++) {
    const rowNo = i + 2 // header di baris 1
    const name = pickField(rows[i], 'nama_kampus', 'namakampus', 'nama', 'kampus', 'universitas', 'name')
    if (!name) {
      result.skipped.push({ row: rowNo, name: '-', reason: 'Nama Kampus kosong' })
      continue
    }
    const slug = slugify(name)
    if (!slug) {
      result.skipped.push({ row: rowNo, name, reason: 'Nama tidak valid' })
      continue
    }
    if (existingSlugs.has(slug) || seenInBatch.has(slug)) {
      result.skipped.push({ row: rowNo, name, reason: 'Sudah ada' })
      continue
    }
    try {
      await prisma.university.create({ data: { name, slug } })
      seenInBatch.add(slug)
      result.created++
    } catch {
      result.skipped.push({ row: rowNo, name, reason: 'Gagal menyimpan baris' })
    }
  }

  revalidatePath('/dashboard/universities')
  revalidatePath('/dashboard/taxonomy')
  return { success: true, message: `${result.created} universitas berhasil diimpor.`, data: result }
}
