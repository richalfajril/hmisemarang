import { z } from 'zod'

export const agendaSchema = z.object({
  title: z.string().min(1, 'Judul agenda wajib diisi.'),
  slug: z.string().optional(),
  flyer_url: z.string().optional().nullable(),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter.'),
  short_description: z.string().max(255, 'Deskripsi singkat maksimal 255 karakter.').optional().nullable(),
  start_datetime: z.string().min(1, 'Tanggal mulai wajib diisi.'), // Usually passed as ISO string
  end_datetime: z.string().optional().nullable(),
  location_name: z.string().optional().nullable(),
  location_url: z.string().url('URL lokasi tidak valid.').optional().nullable().or(z.literal('')),
  // CTA links can be added here if needed, but for MVP we might just use a single simple CTA or handle it separately.
})
  .refine((data) => {
    if (data.end_datetime) {
      const start = new Date(data.start_datetime)
      const end = new Date(data.end_datetime)
      return end > start
    }
    return true
  }, {
    message: 'Tanggal/waktu berakhir harus lebih besar dari waktu mulai.',
    path: ['end_datetime']
  })

export type AgendaFormValues = z.infer<typeof agendaSchema>
