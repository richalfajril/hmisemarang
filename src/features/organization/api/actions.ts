'use server'

import { z } from 'zod'
import { createClient } from '@/shared/api/supabase/server'
import { ActionState } from '@/shared/lib/action-state'
import { prisma } from '@/shared/lib/prisma'
import { revalidatePath } from 'next/cache'

// SCHEMA VALIDATION
const periodSchema = z.object({
  start_year: z.coerce.number().int().min(1947),
  end_year: z.coerce.number().int().min(1947),
})

const positionSchema = z.object({
  period_id: z.string().uuid(),
  name: z.string().min(1, 'Nama jabatan wajib diisi'),
  sort_order: z.coerce.number().int(),
  layout_type: z.string().default('DEFAULT'),
})

const boardMemberSchema = z.object({
  period_id: z.string().uuid(),
  position_id: z.string().uuid(),
  full_name: z.string().min(1, 'Nama anggota wajib diisi'),
  photo_url: z.string().url('URL foto tidak valid').optional().or(z.literal('')),
  short_bio: z.string().optional().or(z.literal('')),
})

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
export async function createPeriodAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const data = Object.fromEntries(formData.entries())
  const parsed = periodSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: 'Validasi form gagal.', fieldErrors: parsed.error.flatten().fieldErrors, errorCode: 'VALIDATION_ERROR' }
  }

  if (parsed.data.end_year < parsed.data.start_year) {
    return { success: false, message: 'Tahun akhir tidak boleh mendahului tahun awal.', errorCode: 'VALIDATION_ERROR' }
  }

  try {
    const existingActive = await prisma.period.findFirst({ where: { is_active: true } })
    const isFirst = !existingActive

    await prisma.period.create({
      data: {
        name: `Periode ${parsed.data.start_year}-${parsed.data.end_year}`,
        start_year: parsed.data.start_year,
        end_year: parsed.data.end_year,
        is_active: isFirst, // Otomatis aktif jika ini adalah periode pertama
      }
    })

    revalidatePath('/dashboard/organization')
    return { success: true, message: 'Periode kepengurusan berhasil dibuat.' }
  } catch (error) {
    return { success: false, message: 'Gagal membuat periode.', errorCode: 'SERVER_ERROR' }
  }
}

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
  } catch (error) {
    return { success: false, message: 'Gagal mengaktifkan periode.', errorCode: 'SERVER_ERROR' }
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
  } catch (error) {
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
  } catch (error) {
    return { success: false, message: 'Gagal menghapus jabatan.', errorCode: 'SERVER_ERROR' }
  }
}

// BOARD MEMBER ACTIONS
export async function createBoardMemberAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!(await checkAuth())) return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }

  const data = Object.fromEntries(formData.entries())
  const parsed = boardMemberSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: 'Validasi form gagal.', fieldErrors: parsed.error.flatten().fieldErrors, errorCode: 'VALIDATION_ERROR' }
  }

  try {
    await prisma.boardMember.create({
      data: {
        period_id: parsed.data.period_id,
        position_id: parsed.data.position_id,
        full_name: parsed.data.full_name,
        photo_url: parsed.data.photo_url || null,
        short_bio: parsed.data.short_bio || null,
      }
    })

    revalidatePath('/dashboard/organization')
    return { success: true, message: 'Anggota pengurus berhasil ditambahkan ke jabatan.' }
  } catch (error) {
    return { success: false, message: 'Gagal menambahkan anggota.', errorCode: 'SERVER_ERROR' }
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
  } catch (error) {
    return { success: false, message: 'Gagal menghapus anggota.', errorCode: 'SERVER_ERROR' }
  }
}
