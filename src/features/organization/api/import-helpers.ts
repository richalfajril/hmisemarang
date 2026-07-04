// Helper import pengurus. pickField/normHeader dipindah ke shared (dipakai lintas modul).
import { pickField } from '@/shared/lib/xlsx-helpers'
export { normHeader, pickField } from '@/shared/lib/xlsx-helpers'

// Kolom sosmed → platform value (X = twitter, sesuai FORM_SOCIAL_PLATFORMS).
const SOCIAL_COLS: { platform: string; keys: string[] }[] = [
  { platform: 'instagram', keys: ['url_instagram', 'instagram'] },
  { platform: 'tiktok', keys: ['url_tiktok', 'tiktok'] },
  { platform: 'twitter', keys: ['url_x', 'url_twitter', 'x', 'twitter'] },
  { platform: 'linkedin', keys: ['url_linkedin', 'linkedin'] },
]

/** Bangun social_links JSON dari kolom URL_* — hanya yang terisi. */
export function buildSocialLinks(row: Record<string, unknown>): { platform: string; url: string }[] {
  return SOCIAL_COLS.map(({ platform, keys }) => ({ platform, url: pickField(row, ...keys) })).filter(
    (s) => s.url.length > 0
  )
}
