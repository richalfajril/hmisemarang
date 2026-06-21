import { z } from 'zod'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const albumSchema = z.object({
  title: z.string().min(3, 'Judul album minimal 3 karakter').max(150),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

// Photo schema is mostly for validation before upload
export const photoSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_IMAGE_SIZE, `Ukuran gambar maksimal 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Hanya format JPG, PNG, dan WebP yang diperbolehkan.'
    ),
})

export type AlbumFormValues = z.infer<typeof albumSchema>
