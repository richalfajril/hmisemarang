import { z } from 'zod'

export const websiteSettingsSchema = z.object({
  site_name: z.string().min(1, 'Nama situs wajib diisi').max(100, 'Maksimal 100 karakter'),
  seo_description: z.string().max(255, 'Maksimal 255 karakter').optional().or(z.literal('')),
  contact_email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  contact_phone: z.string().max(30, 'Maksimal 30 karakter').optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  maps_embed_url: z.string().url('Format URL tidak valid').optional().or(z.literal('')),
  contact_image_url: z.string().url('Format URL tidak valid').optional().or(z.literal('')),
  instagram_url: z.string().url('Format URL tidak valid').optional().or(z.literal('')),
  favicon_url: z.string().url('Format URL tidak valid').optional().or(z.literal('')),
  hero_image_url: z.string().url('Format URL tidak valid').optional().or(z.literal('')),
  dark_logo_url: z.string().url('Format URL tidak valid').optional().or(z.literal('')),
  about_image_url: z.string().url('Format URL tidak valid').optional().or(z.literal('')),
})
