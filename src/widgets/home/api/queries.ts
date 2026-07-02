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

/** Estimasi waktu baca (menit) dari konten HTML. ~200 kata/menit. */
function readingTimeMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export const getFeaturedArticles = cache(async () => {
  try {
    const rows = await prisma.article.findMany({
      where: { status: 'PUBLISHED', deleted_at: null },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featured_image_url: true,
        published_at: true,
        author_name: true,
        author_image_url: true,
        content: true,
        category: { select: { name: true } },
      },
      orderBy: { published_at: 'desc' },
      take: 5,
    })
    return rows.map(({ content, ...a }) => ({
      ...a,
      reading_time: readingTimeMinutes(content),
    }))
  } catch (e) {
    console.error('getFeaturedArticles failed:', e)
    return []
  }
})

/** Semua agenda publik (upcoming + selesai) untuk halaman /agenda. */
export const getAllPublicAgendas = cache(async () => {
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
    })
  } catch (e) {
    console.error('getAllPublicAgendas failed:', e)
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

/** Foto fallback (Unsplash) saat album CMS masih sedikit. */
export const GALLERY_FALLBACK = [
  { id: 'gf1', image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80', caption: 'Suasana forum kaderisasi', album: { title: 'Latihan Kader' } },
  { id: 'gf2', image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80', caption: 'Diskusi & seminar', album: { title: 'Diskusi Publik' } },
  { id: 'gf3', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', caption: 'Seminar nasional', album: { title: 'Seminar' } },
  { id: 'gf4', image_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80', caption: 'Kebersamaan pengurus', album: { title: 'Kegiatan Cabang' } },
  { id: 'gf5', image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80', caption: 'Kerja kolaboratif', album: { title: 'Rapat Kerja' } },
  { id: 'gf6', image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80', caption: 'Wisuda & apresiasi', album: { title: 'Milad HMI' } },
  { id: 'gf7', image_url: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&q=80', caption: 'Bakti sosial', album: { title: 'Pengabdian' } },
  { id: 'gf8', image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', caption: 'Audiensi & silaturahmi', album: { title: 'Silaturahmi' } },
]

/** Jumlah album published (untuk ambang fallback galeri). */
export const getPublicAlbumCount = cache(async () => {
  try {
    return await prisma.galleryAlbum.count({ where: { status: 'PUBLISHED', deleted_at: null } })
  } catch {
    return 0
  }
})

/** Semua foto dari album published (untuk halaman /galeri). */
export const getPublicGalleryPhotos = cache(async () => {
  try {
    return await prisma.galleryPhoto.findMany({
      where: { album: { status: 'PUBLISHED', deleted_at: null } },
      select: {
        id: true,
        image_url: true,
        caption: true,
        album: { select: { title: true } },
      },
      orderBy: { created_at: 'desc' },
    })
  } catch (e) {
    console.error('getPublicGalleryPhotos failed:', e)
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
