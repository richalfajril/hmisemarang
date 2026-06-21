'use server'
import { prisma } from '@/shared/lib/prisma'

import { createClient } from '@/shared/api/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUnreadNotificationsAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, data: [] }

  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser) return { success: false, data: [] }

  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: currentUser.id, is_read: false },
      orderBy: { created_at: 'desc' },
      take: 20 // Ambil 20 terbaru untuk bell
    })
    
    return { success: true, data: notifications }
  } catch (error) {
    console.error('Failed to fetch unread notifications:', error)
    return { success: false, data: [] }
  }
}

export async function markAsReadAction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false }

  try {
    await prisma.notification.update({
      where: { id },
      data: { is_read: true }
    })
    
    revalidatePath('/dashboard') // Revalidate layout
    return { success: true }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
    return { success: false }
  }
}

export async function markAllAsReadAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false }
  
  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser) return { success: false }

  try {
    await prisma.notification.updateMany({
      where: { user_id: currentUser.id, is_read: false },
      data: { is_read: true }
    })
    
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
    return { success: false }
  }
}
