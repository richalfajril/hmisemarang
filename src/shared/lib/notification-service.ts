import { prisma } from '@/shared/api/prisma/client'

type CreateNotificationProps = {
  user_id: string
  title: string
  message: string
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT'
  link_url?: string
}

export async function createNotification(props: CreateNotificationProps) {
  try {
    await prisma.notification.create({
      data: {
        user_id: props.user_id,
        title: props.title,
        message: props.message,
        type: props.type,
        link_url: props.link_url || null,
      }
    })
  } catch (error) {
    console.error('[NOTIFICATION_ERROR] Failed to create notification:', error)
  }
}
