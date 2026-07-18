import { z } from 'zod'

export const articleSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi.').max(120, 'Judul maksimal 120 karakter.'),
  slug: z.string().optional(), // Server will generate if empty
  excerpt: z.string().max(255, 'Excerpt maksimal 255 karakter.').optional().nullable(),
  content: z.string().min(50, 'Konten artikel minimal 50 karakter.'),
  featured_image_url: z.string().min(1, 'Gambar fitur wajib diunggah.'),
  featured_image_caption: z.string().max(255, 'Keterangan gambar maksimal 255 karakter.').optional().nullable(),
  category_id: z.string().uuid('Kategori tidak valid.'),
  author_name: z.string().max(100, 'Nama penulis maksimal 100 karakter.').optional().nullable(),
  author_image_url: z.string().optional().nullable(),
  author_commissariat: z.string().max(100, 'Asal komisariat maksimal 100 karakter.').optional().nullable(),
  // Tags array (UUID strings)
  tag_ids: z.array(z.string().uuid()).optional().default([]),
})

export type ArticleFormValues = z.infer<typeof articleSchema>
