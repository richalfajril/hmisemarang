import { z } from 'zod'
import { UserRole } from '@prisma/client'

export const createUserSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  role: z.nativeEnum(UserRole),
  commissariat_id: z.string().optional(),
})

export const forceResetSchema = z.object({
  userId: z.string().uuid(),
})
