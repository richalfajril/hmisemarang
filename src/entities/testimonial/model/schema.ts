import { z } from 'zod'

export const testimonialSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(120),
  title: z.string().min(1, 'Title wajib diisi').max(160),
  quote: z.string().min(1, 'Kutipan wajib diisi').max(600),
  photo_url: z.string().min(1, 'Foto wajib diunggah'),
  featured: z.coerce.boolean().default(false),
  is_published: z.coerce.boolean().default(false),
  display_order: z.coerce
    .number()
    .int('Display order harus bilangan bulat')
    .min(0, 'Display order minimal 0')
    .default(0),
})

export type TestimonialFormValues = z.infer<typeof testimonialSchema>
