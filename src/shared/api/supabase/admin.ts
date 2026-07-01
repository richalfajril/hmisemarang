import { createClient } from '@supabase/supabase-js'
import { env } from '@/shared/config/config'

if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is missing. Admin operations will fail.')
}

/**
 * Supabase Admin Client.
 * ONLY use this in Server Actions or Route Handlers.
 * NEVER expose this to the client-side as it bypasses Row Level Security (RLS).
 */
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || '',
  env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
