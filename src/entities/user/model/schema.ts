import { z } from 'zod'
import { UserRole } from '@prisma/client'

export const createUserSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  username: z
    .string()
    .min(3, 'Username minimal 3 karakter')
    .max(50, 'Username maksimal 50 karakter')
    .regex(/^[a-z0-9._-]+$/i, 'Username hanya boleh huruf, angka, titik, garis bawah, strip'),
  name: z.string().max(100, 'Nama maksimal 100 karakter').optional().or(z.literal('')),
  role: z.nativeEnum(UserRole).default('ADMIN_CABANG'),
  commissariat_id: z.string().optional(),
})

export const forceResetSchema = z.object({
  userId: z.string().uuid(),
})
