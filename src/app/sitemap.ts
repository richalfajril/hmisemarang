import type { MetadataRoute } from 'next'
import { prisma } from '@/shared/api/prisma/client'
import { SITE_URL } from '@/widgets/public-layout/config/site'

export const revalidate = 3600

const STATIC_PATHS = [
  '',
  '/profil',
  '/struktur-organisasi',
  '/artikel',
  '/agenda',
  '/komisariat',
  '/galeri',
  '/dokumen',
  '/kontak',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === '' ? 'daily' : 'weekly',
    priority: p === '' ? 1 : 0.7,
  }))

  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED', deleted_at: null },
      select: { slug: true, updated_at: true },
    })
    const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
      url: `${SITE_URL}/artikel/${a.slug}`,
      lastModified: a.updated_at,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
    return [...staticEntries, ...articleEntries]
  } catch {
    return staticEntries
  }
}
