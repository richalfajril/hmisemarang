import { cache } from 'react'
import { prisma } from '@/shared/api/prisma/client'

// Error handling: query gagal → kembalikan [] (graceful). Section meng-handle
// dengan merge fallback / empty state, sehingga DB error tidak men-crash halaman.

export const getPublicCommissariats = cache(async () => {
  try {
    return await prisma.commissariat.findMany({
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
  } catch (e) {
    console.error('getPublicCommissariats failed:', e)
    return []
  }
})

export const getFeaturedArticles = cache(async () => {
  try {
    return await prisma.article.findMany({
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
  } catch (e) {
    console.error('getFeaturedArticles failed:', e)
    return []
  }
})

export const getUpcomingAgendas = cache(async () => {
  try {
    return await prisma.agenda.findMany({
      where: { status: 'PUBLISHED', deleted_at: null },
      select: {
        id: true,
        title: true,
        slug: true,
        flyer_url: true,
        start_datetime: true,
        end_datetime: true,
        location_name: true,
      },
      orderBy: { start_datetime: 'asc' },
      take: 8,
    })
  } catch (e) {
    console.error('getUpcomingAgendas failed:', e)
    return []
  }
})

export type PublicTestimonial = {
  id: string
  photoUrl: string | null
  quote: string
  name: string
  title: string
}

// Homepage: hanya Testimoni Published + Featured, urut displayOrder asc → updatedAt desc.
export const getTestimonials = cache(async (): Promise<PublicTestimonial[]> => {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { is_published: true, featured: true },
      orderBy: [{ display_order: 'asc' }, { updated_at: 'desc' }],
      select: { id: true, photo_url: true, quote: true, name: true, title: true },
    })
    return rows.map((t) => ({
      id: t.id,
      photoUrl: t.photo_url,
      quote: t.quote,
      name: t.name,
      title: t.title,
    }))
  } catch (e) {
    console.error('getTestimonials failed:', e)
    return []
  }
})

export const getGalleryAlbums = cache(async () => {
  try {
    return await prisma.galleryAlbum.findMany({
      where: { status: 'PUBLISHED', deleted_at: null, cover_image_url: { not: null } },
      select: { id: true, title: true, slug: true, cover_image_url: true },
      orderBy: { created_at: 'desc' },
      take: 8,
    })
  } catch (e) {
    console.error('getGalleryAlbums failed:', e)
    return []
  }
})
