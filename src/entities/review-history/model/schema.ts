import { z } from 'zod'

export const ReviewEntityTypeSchema = z.enum(['ARTICLE', 'AGENDA', 'COMMISSARIAT_PROFILE', 'CADRE_VERIFICATION'])
export const ReviewActionEnumSchema = z.enum(['APPROVED', 'REVISION', 'REJECTED'])

export type ReviewEntityType = z.infer<typeof ReviewEntityTypeSchema>
export type ReviewActionEnum = z.infer<typeof ReviewActionEnumSchema>

export const reviewSchema = z.object({
  entity_id: z.string().uuid(),
  entity_type: ReviewEntityTypeSchema,
  action: ReviewActionEnumSchema,
  note: z.string().optional().nullable(),
  row_count: z.coerce.number().min(1, 'Jumlah kader harus lebih dari 0').optional().nullable(),
}).refine((data) => {
  if ((data.action === 'REJECTED' || data.action === 'REVISION') && (!data.note || data.note.trim().length < 10)) {
    return false
  }
  if (data.entity_type === 'CADRE_VERIFICATION' && data.action === 'APPROVED' && !data.row_count) {
    return false // Wajib isi jumlah kader saat approve
  }
  return true
}, {
  message: 'Catatan wajib diisi (Min 10 karakter) untuk penolakan. Untuk verifikasi kader, jumlah valid kader wajib diisi saat approve.',
  path: ['note']
})

export type ReviewFormValues = z.infer<typeof reviewSchema>
