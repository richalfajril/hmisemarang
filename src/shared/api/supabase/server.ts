import { prisma } from '@/shared/lib/prisma'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}


export async function getUserSession() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return null

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (!dbUser) return null

    return {
      user: {
        ...user,
        id: dbUser.id,
        role: dbUser.role,
        commissariatId: dbUser.commissariat_id,
      },
      // Mocking request IP for now since we can't easily get it here
      request: {
        ip: '127.0.0.1',
        userAgent: 'Next.js Server',
      }
    }
  } catch (error) {
    console.error('Failed to get user session from database:', error)
    return null
  }
}
