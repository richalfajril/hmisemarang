'use server'

import { createClient } from '@/shared/api/supabase/server'
import { prisma } from '@/shared/api/prisma/client'
import { ActionState } from '@/shared/lib/action-state'
import { redirect } from 'next/navigation'
import { loginSchema } from './schema'

export async function loginAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData.entries())
  const parsed = loginSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      message: 'Terdapat kesalahan pada isian formulir.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      errorCode: 'VALIDATION_ERROR',
    }
  }

  // Username → cari email terkait (Supabase Auth tetap berbasis email).
  const account = await prisma.user.findUnique({
    where: { username: parsed.data.username },
    select: { email: true },
  })

  if (!account) {
    return {
      success: false,
      message: 'Username atau kata sandi tidak cocok. Silakan coba lagi.',
      errorCode: 'UNAUTHORIZED',
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: parsed.data.password,
  })

  if (error) {
    return {
      success: false,
      message: 'Username atau kata sandi tidak cocok. Silakan coba lagi.',
      errorCode: 'UNAUTHORIZED',
    }
  }

  // Pengalihan hanya dilakukan jika sukses. Next.js mewajibkan ini tidak ditangkap oleh blok try-catch.
  redirect('/dashboard')
}

export async function changePasswordAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (password.length < 6) {
    return { success: false, message: 'Kata sandi minimal 6 karakter.', fieldErrors: { password: ['Minimal 6 karakter'] }, errorCode: 'VALIDATION_ERROR' }
  }
  if (password !== confirm) {
    return { success: false, message: 'Konfirmasi kata sandi tidak cocok.', fieldErrors: { confirm: ['Tidak cocok'] }, errorCode: 'VALIDATION_ERROR' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Belum masuk sistem.', errorCode: 'UNAUTHORIZED' }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    return { success: false, message: `Gagal mengubah kata sandi: ${error.message}`, errorCode: 'SERVER_ERROR' }
  }
  return { success: true, message: 'Kata sandi berhasil diubah.' }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
