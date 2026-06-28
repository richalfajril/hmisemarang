import { cache } from 'react'
import { prisma } from '@/shared/api/prisma/client'

export const getPublicCommissariats = cache(async () =>
  prisma.commissariat.findMany({
    where: { is_active: true },
    select: {
      id: true,
      name: true,
      slug: true,
      logo_url: true,
      campus_name: true,
      cadre_count: true,
      university: { select: { name: true } },
    },
    orderBy: { name: 'asc' },
  })
)

export const getFeaturedArticles = cache(async () =>
  prisma.article.findMany({
    where: { status: 'PUBLISHED', deleted_at: null },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featured_image_url: true,
      published_at: true,
      category: { select: { name: true } },
    },
    orderBy: { published_at: 'desc' },
    take: 5,
  })
)
