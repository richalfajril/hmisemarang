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
    const [articles, agendas, komisariat] = await Promise.all([
      prisma.article.findMany({
        where: { status: 'PUBLISHED', deleted_at: null },
        select: { slug: true, updated_at: true },
      }),
      prisma.agenda.findMany({
        where: { status: 'PUBLISHED', deleted_at: null },
        select: { slug: true, updated_at: true },
      }),
      prisma.commissariat.findMany({
        where: { is_active: true },
        select: { slug: true, updated_at: true },
      }),
    ])
    const dynamicEntries: MetadataRoute.Sitemap = [
      ...articles.map((a) => ({
        url: `${SITE_URL}/artikel/${a.slug}`,
        lastModified: a.updated_at,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
      ...agendas.map((a) => ({
        url: `${SITE_URL}/agenda/${a.slug}`,
        lastModified: a.updated_at,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
      ...komisariat.map((c) => ({
        url: `${SITE_URL}/komisariat/${c.slug}`,
        lastModified: c.updated_at,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })),
    ]
    return [...staticEntries, ...dynamicEntries]
  } catch {
    return staticEntries
  }
}
