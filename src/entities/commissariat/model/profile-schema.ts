import { z } from 'zod'

export const profileSubmissionSchema = z.object({
  name: z.string().min(3, 'Nama harus minimal 3 karakter').max(100),
  campus_name: z.string().min(3, 'Nama kampus harus minimal 3 karakter').max(100),
  about: z.string().optional(),
  
  chairman_name: z.string().min(3, 'Nama ketua harus minimal 3 karakter').max(100),
  chairman_period: z.string().optional(),
  chairman_about: z.string().optional(),
  
  address: z.string().optional(),
  map_url: z.union([z.string().url('Format URL peta tidak valid'), z.literal('')]).optional(),
  instagram_url: z.union([z.string().url('Format URL Instagram tidak valid'), z.literal('')]).optional(),
  
  logo_url: z.string().optional(),
  secretariat_photo_url: z.string().optional(),
})

export type ProfileSubmissionFormValues = z.infer<typeof profileSubmissionSchema>
