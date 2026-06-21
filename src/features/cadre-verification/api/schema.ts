import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_FILE_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xls',
  '.xlsx'
]

export const cadreVerificationSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Ukuran file maksimal 10MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type) || file.name.endsWith('.xls') || file.name.endsWith('.xlsx'),
      'Hanya format Excel (.xls, .xlsx) yang diperbolehkan.'
    ),
})
