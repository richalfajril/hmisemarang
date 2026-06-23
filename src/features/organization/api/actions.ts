'use server'
import { prisma } from '@/shared/api/prisma/client'

import { z } from 'zod'
import { createClient } from '@/shared/api/supabase/server'
import { ActionState } from '@/shared/lib/action-state'
import { revalidatePath } from 'next/cache'

// SCHEMA VALIDATION
const periodSchema = z.object({
  start_year: z.coerce.number().int().min(1947),
  end_year: z.coerce.number().int().min(1947),
})

const POSITION_GROUPS = ['KSB', 'KETUA_BIDANG', 'LAINNYA'] as const

const positionSchema = z.object({
  period_id: z.string().uuid(),
  name: z.string().min(1, 'Nama jabatan wajib diisi'),
  sort_order: z.coerce.number().int(),
  layout_type: z.enum(POSITION_GROUPS).default('KETUA_BIDANG'),
})

const boardMemberSchema = z.object({
  position_id: z.string().uuid('Jabatan wajib dipilih'),
  full_name: z.string().min(1, 'Nama wajib diisi'),
  photo_url: z.string().url('Foto wajib diunggah'),
  university_id: z.string().uuid('Kampus wajib dipilih'),
  commissariat_id: z.string().uuid('Komisariat wajib dipilih'),
  short_bio: z.string().max(200, 'Bio maksimal 200 karakter').optional().or(z.literal('')),
})

function parseSocialLinks(raw: string | null): { platform: string; url: string }[] {
  if (!raw) return []
  try {
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return arr
      .filter((s) => s && typeof s.url === 'string' && s.url.trim().length > 0)
      .map((s) => ({ platform: String(s.platform || 'website'), url: String(s.url).trim() }))
  } catch (_e) {
    return []
  }
}

// CHECK AUTH HELPER
async function checkAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) return null
  return currentUser
}

// PERIOD ACTIONS
export async function activatePeriodAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const id = formData.get('id') as string
  if (!id) return { success: false, message: 'ID Periode tidak valid', errorCode: 'VALIDATION_ERROR' }

  try {
    // Jalankan dalam transaksi: nonaktifkan semua, lalu aktifkan satu.
    await prisma.$transaction([
      prisma.period.updateMany({ data: { is_active: false } }),
      prisma.period.update({ where: { id }, data: { is_active: true } })
    ])

    revalidatePath('/', 'layout') // Revalidate semua halaman publik
    return { success: true, message: 'Periode berhasil diaktifkan. Situs publik kini menampilkan susunan pengurus ini.' }
  } catch (_error) {
    return { success: false, message: 'Gagal mengaktifkan periode.', errorCode: 'SERVER_ERROR' }
  }
}

export async function archivePeriodAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const id = formData.get('id') as string
  if (!id) return { success: false, message: 'ID Periode tidak valid', errorCode: 'VALIDATION_ERROR' }

  try {
    // Soft delete: nonaktifkan periode. Data tetap utuh, tidak lagi tampil di homepage.
    await prisma.period.update({ where: { id }, data: { is_active: false } })

    revalidatePath('/dashboard/organization')
    revalidatePath('/', 'layout')
    return { success: true, message: 'Periode diarsipkan. Data tetap tersimpan namun tidak lagi tampil di homepage.' }
  } catch (_error) {
    return { success: false, message: 'Gagal mengarsipkan periode.', errorCode: 'SERVER_ERROR' }
  }
}

export async function updatePeriodAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const id = formData.get('id') as string
  if (!id) return { success: false, message: 'ID Periode tidak valid', errorCode: 'VALIDATION_ERROR' }

  const parsed = periodSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return { success: false, message: 'Validasi form gagal.', fieldErrors: parsed.error.flatten().fieldErrors, errorCode: 'VALIDATION_ERROR' }
  }

  const { start_year, end_year } = parsed.data
  if (end_year < start_year) {
    return { success: false, message: 'Tahun akhir tidak boleh mendahului tahun awal.', errorCode: 'VALIDATION_ERROR' }
  }

  try {
    const duplicate = await prisma.period.findFirst({ where: { start_year, end_year, id: { not: id } } })
    if (duplicate) {
      return { success: false, message: `Periode ${start_year}-${end_year} sudah ada.`, errorCode: 'VALIDATION_ERROR' }
    }

    await prisma.period.update({
      where: { id },
      data: {
        name: `Periode ${start_year}-${end_year}`,
        start_year,
        end_year,
      }
    })

    revalidatePath('/dashboard/organization')
    revalidatePath('/', 'layout')
    return { success: true, message: 'Periode kepengurusan berhasil diperbarui.' }
  } catch (_error) {
    return { success: false, message: 'Gagal memperbarui periode.', errorCode: 'SERVER_ERROR' }
  }
}

export async function deletePeriodAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const id = formData.get('id') as string
  if (!id) return { success: false, message: 'ID Periode tidak valid', errorCode: 'VALIDATION_ERROR' }

  try {
    const period = await prisma.period.findUnique({ where: { id } })
    if (!period) return { success: false, message: 'Periode tidak ditemukan.', errorCode: 'NOT_FOUND' }
    if (period.is_active) {
      return { success: false, message: 'Tidak dapat menghapus periode yang sedang aktif. Aktifkan periode lain terlebih dahulu.', errorCode: 'VALIDATION_ERROR' }
    }

    // Cascade menghapus seluruh jabatan & anggota pada periode ini (onDelete: Cascade).
    await prisma.period.delete({ where: { id } })

    revalidatePath('/dashboard/organization')
    revalidatePath('/', 'layout')
    return { success: true, message: 'Periode beserta seluruh jabatan & anggotanya berhasil dihapus.' }
  } catch (_error) {
    return { success: false, message: 'Gagal menghapus periode.', errorCode: 'SERVER_ERROR' }
  }
}

// POSITION ACTIONS
export async function createPositionAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const data = Object.fromEntries(formData.entries())
  const parsed = positionSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: 'Validasi form gagal.', fieldErrors: parsed.error.flatten().fieldErrors, errorCode: 'VALIDATION_ERROR' }
  }

  try {
    await prisma.position.create({
      data: {
        period_id: parsed.data.period_id,
        name: parsed.data.name,
        sort_order: parsed.data.sort_order,
        layout_type: parsed.data.layout_type,
      }
    })

    revalidatePath('/dashboard/organization')
    return { success: true, message: 'Posisi jabatan berhasil ditambahkan.' }
  } catch (_error) {
    return { success: false, message: 'Gagal membuat jabatan.', errorCode: 'SERVER_ERROR' }
  }
}

export async function deletePositionAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const id = formData.get('id') as string
  if (!id) return { success: false, message: 'ID tidak valid', errorCode: 'VALIDATION_ERROR' }

  try {
    await prisma.position.delete({ where: { id } })
    revalidatePath('/dashboard/organization')
    return { success: true, message: 'Jabatan beserta anggotanya berhasil dihapus.' }
  } catch (_error) {
    return { success: false, message: 'Gagal menghapus jabatan.', errorCode: 'SERVER_ERROR' }
  }
}

export async function updatePositionAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const id = formData.get('id') as string
  const name = (formData.get('name') as string)?.trim()
  const rawLayout = formData.get('layout_type') as string | null
  const layout_type = POSITION_GROUPS.includes(rawLayout as typeof POSITION_GROUPS[number]) ? rawLayout! : undefined
  if (!id) return { success: false, message: 'ID tidak valid', errorCode: 'VALIDATION_ERROR' }
  if (!name) return { success: false, message: 'Nama jabatan wajib diisi.', errorCode: 'VALIDATION_ERROR' }

  try {
    await prisma.position.update({ where: { id }, data: { name, ...(layout_type ? { layout_type } : {}) } })
    revalidatePath('/dashboard/organization')
    return { success: true, message: 'Jabatan berhasil diperbarui.' }
  } catch (_error) {
    return { success: false, message: 'Gagal memperbarui jabatan.', errorCode: 'SERVER_ERROR' }
  }
}

// TAMBAH PERIODE: buat periode baru sekaligus daftar jabatannya (dengan grup layout)
export async function createPositionStructureAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  // positions_json: array of { name, layout }
  let positions: { name: string; layout: typeof POSITION_GROUPS[number] }[] = []
  try {
    const raw = JSON.parse((formData.get('positions_json') as string) || '[]')
    if (Array.isArray(raw)) {
      positions = raw
        .map((p) => ({
          name: String(p?.name ?? '').trim(),
          layout: (POSITION_GROUPS.includes(p?.layout) ? p.layout : 'KETUA_BIDANG') as typeof POSITION_GROUPS[number],
        }))
        .filter((p) => p.name.length > 0)
    }
  } catch (_e) {
    positions = []
  }

  if (positions.length === 0) {
    return { success: false, message: 'Tambahkan minimal satu jabatan.', errorCode: 'VALIDATION_ERROR' }
  }

  const parsed = periodSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return { success: false, message: 'Validasi periode gagal.', fieldErrors: parsed.error.flatten().fieldErrors, errorCode: 'VALIDATION_ERROR' }
  }

  const { start_year, end_year } = parsed.data
  if (end_year < start_year) {
    return { success: false, message: 'Tahun akhir tidak boleh mendahului tahun awal.', errorCode: 'VALIDATION_ERROR' }
  }

  try {
    const duplicate = await prisma.period.findFirst({ where: { start_year, end_year } })
    if (duplicate) {
      return { success: false, message: `Periode ${start_year}-${end_year} sudah ada.`, errorCode: 'VALIDATION_ERROR' }
    }

    const existingActive = await prisma.period.findFirst({ where: { is_active: true } })
    const isFirst = !existingActive

    const periodId = await prisma.$transaction(async (tx) => {
      const period = await tx.period.create({
        data: {
          name: `Periode ${start_year}-${end_year}`,
          start_year,
          end_year,
          is_active: isFirst,
        }
      })

      await tx.position.createMany({
        data: positions.map((p, index) => ({
          period_id: period.id,
          name: p.name,
          sort_order: index + 1,
          layout_type: p.layout,
        }))
      })

      return period.id
    })

    revalidatePath('/dashboard/organization')
    return {
      success: true,
      message: `Periode ${start_year}-${end_year} dengan ${positions.length} jabatan berhasil dibuat.`,
      data: { periodId },
    }
  } catch (_error) {
    return { success: false, message: 'Gagal membuat periode.', errorCode: 'SERVER_ERROR' }
  }
}

// EDIT PERIODE: perbarui tahun + sinkronkan daftar jabatan (tambah/rename/grup/hapus)
export async function updatePeriodStructureAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const periodId = formData.get('period_id') as string
  if (!periodId) return { success: false, message: 'ID Periode tidak valid', errorCode: 'VALIDATION_ERROR' }

  let rows: { id?: string; name: string; layout: typeof POSITION_GROUPS[number] }[] = []
  try {
    const raw = JSON.parse((formData.get('positions_json') as string) || '[]')
    if (Array.isArray(raw)) {
      rows = raw
        .map((p) => ({
          id: typeof p?.id === 'string' ? p.id : undefined,
          name: String(p?.name ?? '').trim(),
          layout: (POSITION_GROUPS.includes(p?.layout) ? p.layout : 'KETUA_BIDANG') as typeof POSITION_GROUPS[number],
        }))
        .filter((p) => p.name.length > 0)
    }
  } catch (_e) {
    rows = []
  }

  if (rows.length === 0) {
    return { success: false, message: 'Tambahkan minimal satu jabatan.', errorCode: 'VALIDATION_ERROR' }
  }

  const parsed = periodSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return { success: false, message: 'Validasi periode gagal.', fieldErrors: parsed.error.flatten().fieldErrors, errorCode: 'VALIDATION_ERROR' }
  }

  const { start_year, end_year } = parsed.data
  if (end_year < start_year) {
    return { success: false, message: 'Tahun akhir tidak boleh mendahului tahun awal.', errorCode: 'VALIDATION_ERROR' }
  }

  try {
    const period = await prisma.period.findUnique({ where: { id: periodId }, include: { positions: { select: { id: true } } } })
    if (!period) return { success: false, message: 'Periode tidak ditemukan.', errorCode: 'NOT_FOUND' }

    const duplicate = await prisma.period.findFirst({ where: { start_year, end_year, id: { not: periodId } } })
    if (duplicate) {
      return { success: false, message: `Periode ${start_year}-${end_year} sudah ada.`, errorCode: 'VALIDATION_ERROR' }
    }

    const existingIds = period.positions.map((p) => p.id)
    const keptIds = rows.filter((r) => r.id && existingIds.includes(r.id)).map((r) => r.id as string)
    const toDelete = existingIds.filter((id) => !keptIds.includes(id))

    await prisma.$transaction(async (tx) => {
      await tx.period.update({
        where: { id: periodId },
        data: { name: `Periode ${start_year}-${end_year}`, start_year, end_year },
      })

      // Update existing & create new (sort_order mengikuti urutan baris)
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        if (row.id && existingIds.includes(row.id)) {
          await tx.position.update({
            where: { id: row.id },
            data: { name: row.name, layout_type: row.layout, sort_order: i + 1 },
          })
        } else {
          await tx.position.create({
            data: { period_id: periodId, name: row.name, layout_type: row.layout, sort_order: i + 1 },
          })
        }
      }

      // Hapus jabatan yang dibuang dari daftar (cascade ke anggotanya)
      if (toDelete.length > 0) {
        await tx.position.deleteMany({ where: { id: { in: toDelete } } })
      }
    })

    revalidatePath('/dashboard/organization')
    revalidatePath('/', 'layout')
    return { success: true, message: 'Periode kepengurusan berhasil diperbarui.' }
  } catch (_error) {
    return { success: false, message: 'Gagal memperbarui periode.', errorCode: 'SERVER_ERROR' }
  }
}

// BOARD MEMBER ACTIONS
export async function createBoardMemberAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const parsed = boardMemberSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return { success: false, message: 'Mohon lengkapi data wajib.', fieldErrors: parsed.error.flatten().fieldErrors, errorCode: 'VALIDATION_ERROR' }
  }

  const socialLinks = parseSocialLinks(formData.get('social_links') as string | null)

  try {
    const position = await prisma.position.findUnique({ where: { id: parsed.data.position_id } })
    if (!position) return { success: false, message: 'Jabatan tidak ditemukan.', errorCode: 'NOT_FOUND' }

    await prisma.boardMember.create({
      data: {
        period_id: position.period_id,
        position_id: parsed.data.position_id,
        full_name: parsed.data.full_name,
        photo_url: parsed.data.photo_url,
        short_bio: parsed.data.short_bio || null,
        university_id: parsed.data.university_id,
        commissariat_id: parsed.data.commissariat_id,
        social_links: socialLinks,
      }
    })

    revalidatePath('/dashboard/organization')
    revalidatePath('/', 'layout')
    return { success: true, message: 'Pengurus berhasil ditambahkan.' }
  } catch (_error) {
    return { success: false, message: 'Gagal menambahkan pengurus.', errorCode: 'SERVER_ERROR' }
  }
}

export async function updateBoardMemberAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const id = formData.get('id') as string
  if (!id) return { success: false, message: 'ID tidak valid', errorCode: 'VALIDATION_ERROR' }

  const parsed = boardMemberSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return { success: false, message: 'Mohon lengkapi data wajib.', fieldErrors: parsed.error.flatten().fieldErrors, errorCode: 'VALIDATION_ERROR' }
  }

  const socialLinks = parseSocialLinks(formData.get('social_links') as string | null)

  try {
    const position = await prisma.position.findUnique({ where: { id: parsed.data.position_id } })
    if (!position) return { success: false, message: 'Jabatan tidak ditemukan.', errorCode: 'NOT_FOUND' }

    await prisma.boardMember.update({
      where: { id },
      data: {
        period_id: position.period_id,
        position_id: parsed.data.position_id,
        full_name: parsed.data.full_name,
        photo_url: parsed.data.photo_url,
        short_bio: parsed.data.short_bio || null,
        university_id: parsed.data.university_id,
        commissariat_id: parsed.data.commissariat_id,
        social_links: socialLinks,
      }
    })

    revalidatePath('/dashboard/organization')
    revalidatePath('/', 'layout')
    return { success: true, message: 'Data pengurus berhasil diperbarui.' }
  } catch (_error) {
    return { success: false, message: 'Gagal memperbarui pengurus.', errorCode: 'SERVER_ERROR' }
  }
}

export async function deleteBoardMemberAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const id = formData.get('id') as string
  if (!id) return { success: false, message: 'ID tidak valid', errorCode: 'VALIDATION_ERROR' }

  try {
    await prisma.boardMember.delete({ where: { id } })
    revalidatePath('/dashboard/organization')
    return { success: true, message: 'Anggota pengurus berhasil dicopot.' }
  } catch (_error) {
    return { success: false, message: 'Gagal menghapus anggota.', errorCode: 'SERVER_ERROR' }
  }
}
