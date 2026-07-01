import { prisma } from '@/shared/api/prisma/client'
import { Prisma } from '@prisma/client'
import { headers } from 'next/headers'

type LogActionProps = {
  actor_id?: string
  entity_type: string
  entity_id: string
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'VIEWED' | 'LOGIN' | 'LOGOUT' | 'PUBLISHED' | 'ARCHIVED'
  oldData?: unknown
  newData?: unknown
}

export async function logAuditAction(props: LogActionProps) {
  try {
    const headersList = await headers()
    
    // Attempt to get IP
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ip_address = forwardedFor ? forwardedFor.split(',')[0] : realIp || 'Unknown IP'
    
    // Attempt to get user agent
    const browser = headersList.get('user-agent') || 'Unknown Browser'

    await prisma.auditLog.create({
      data: {
        actor_id: props.actor_id,
        entity_type: props.entity_type,
        entity_id: props.entity_id,
        action: props.action,
        old_data: props.oldData ? (props.oldData as Prisma.InputJsonValue) : undefined,
        new_data: props.newData ? (props.newData as Prisma.InputJsonValue) : undefined,
        ip_address,
        browser,
      }
    })
  } catch (error) {
    // We intentionally don't throw here to avoid failing the main transaction
    // just because logging failed.
    console.error('[AUDIT_LOG_ERROR] Failed to record audit log:', error)
  }
}
