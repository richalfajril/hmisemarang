'use server'

import { z } from 'zod'
import { createClient } from '@/shared/api/supabase/server'
import { supabaseAdmin } from '@/shared/lib/supabase-admin'
import { ActionState } from '@/shared/lib/action-state'
import { prisma } from '@/shared/lib/prisma'

const forceResetSchema = z.object({
  userId: z.string().uuid(),
})

export async function forceResetPasswordAction(
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

  const data = Object.fromEntries(formData.entries())
  const parsed = forceResetSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: 'Data ID pengguna tidak valid.', errorCode: 'VALIDATION_ERROR' }
  }

  // Mencegah admin reset password miliknya sendiri dari sini (Harus via menu akun pribadi)
  if (parsed.data.userId === currentUser.id) {
    return { success: false, message: 'Tidak dapat menyetel ulang sandi Anda sendiri dari panel ini.', errorCode: 'VALIDATION_ERROR' }
  }

  const randomStr = Math.random().toString(36).slice(-6)
  const tempPassword = `Hmi-${randomStr}!`

  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(parsed.data.userId, {
      password: tempPassword,
    })

    if (error) {
      return { success: false, message: `Gagal menyetel ulang: ${(error as Error).message}`, errorCode: 'SERVER_ERROR' }
    }

    return {
      success: true,
      message: 'Kata sandi berhasil disetel ulang.',
      data: { tempPassword },
    }
  } catch (error) {
    console.error('Force Reset Error:', error)
    return { success: false, message: 'Terjadi kesalahan sistem saat menghubungi server otentikasi.', errorCode: 'SERVER_ERROR' }
  }
}
