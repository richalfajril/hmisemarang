'use server'

import { createClient } from '@/shared/api/supabase/server'
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

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return {
      success: false,
      message: 'Email atau kata sandi tidak cocok. Silakan coba lagi.',
      errorCode: 'UNAUTHORIZED',
    }
  }

  // Pengalihan hanya dilakukan jika sukses. Next.js mewajibkan ini tidak ditangkap oleh blok try-catch.
  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
