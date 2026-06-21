import { z } from 'zod'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const ACCEPTED_FILE_TYPES = ['application/pdf']

export const documentSchema = z.object({
  title: z.string().min(5, 'Judul dokumen minimal 5 karakter').max(150),
  description: z.string().optional(),
  category_id: z.string().uuid('Kategori wajib dipilih'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  
  // File is optional during UPDATE if they don't replace it
  file: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Ukuran file maksimal 20MB.`)
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type) || file.name.endsWith('.pdf'),
      'Hanya format PDF yang diperbolehkan.'
    ),
})

export type DocumentFormValues = z.infer<typeof documentSchema>
