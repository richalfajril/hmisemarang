import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(), // Opsional di dev karena Prisma Postgres
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
})

// Melakukan validasi pasif, jika tidak valid akan menampilkan console warning, bukan crash hard
// karena Next.js butuh ENV di runtime, dan Vercel sering me-skip env di build time.
const parsedEnv = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
})

if (!parsedEnv.success) {
  console.warn('⚠️ Environment Variables tidak lengkap:', parsedEnv.error.format())
}

export const env = parsedEnv.success ? parsedEnv.data : (process.env as unknown as z.infer<typeof envSchema>)
