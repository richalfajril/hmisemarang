'use server'

import { z } from 'zod'
import { createClient } from '@/shared/api/supabase/server'
import { supabaseAdmin } from '@/shared/lib/supabase-admin'
import { ActionState } from '@/shared/lib/action-state'
import { revalidatePath } from 'next/cache'
import { UserRole } from '@prisma/client'
import { prisma } from '@/shared/lib/prisma'

const createUserSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  role: z.nativeEnum(UserRole),
  commissariat_id: z.string().optional(),
})

export async function createUserAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState<{ tempPassword: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Belum masuk sistem.', errorCode: 'UNAUTHORIZED' }
  }

  // Authorize User
  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    return { success: false, message: 'Akses ditolak.', errorCode: 'UNAUTHORIZED' }
  }

  // Validate Input
  const data = Object.fromEntries(formData.entries())
  const parsed = createUserSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      message: 'Kesalahan validasi data formulir.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      errorCode: 'VALIDATION_ERROR',
    }
  }

  // Validasi: Jika role ADMIN_KOMISARIAT, maka commissariat_id harus diisi
  if (parsed.data.role === 'ADMIN_KOMISARIAT' && !parsed.data.commissariat_id) {
    return {
      success: false,
      message: 'Admin Komisariat wajib memiliki relasi Komisariat.',
      fieldErrors: { commissariat_id: ['Wajib dipilih'] },
      errorCode: 'VALIDATION_ERROR',
    }
  }

  // Generate Kata Sandi Sementara Acak
  const randomStr = Math.random().toString(36).slice(-6)
  const tempPassword = `Hmi-${randomStr}!`

  try {
    // 1. Sinkronisasi Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: parsed.data.email,
      password: tempPassword,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      return { success: false, message: `Gagal mendaftarkan email ke sistem autentikasi: ${authError?.message}`, errorCode: 'SERVER_ERROR' }
    }

    // 2. Sinkronisasi Database Prisma
    await prisma.user.create({
      data: {
        id: authData.user.id,
        email: parsed.data.email,
        role: parsed.data.role,
        commissariat_id: parsed.data.commissariat_id || null,
      },
    })

    revalidatePath('/dashboard/users')

    return {
      success: true,
      message: 'Pengguna berhasil ditambahkan ke sistem.',
      data: { tempPassword },
    }
  } catch (error) {
    console.error('Create User Error:', error)
    return { success: false, message: 'Gagal menyimpan data pengguna ke basis data.', errorCode: 'SERVER_ERROR' }
  }
}
