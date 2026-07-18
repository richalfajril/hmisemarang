import { cache } from 'react'
import { prisma } from '@/shared/api/prisma/client'

export type PublicArticle = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image_url: string | null
  published_at: Date | string | null
  author_name: string | null
  author_image_url: string | null
  reading_time: number
  view_count: number
  category: { name: string } | null
}

/** Estimasi waktu baca (menit) dari konten HTML. ~200 kata/menit. */
function readingTimeMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/** Ambil teks paragraf pertama dari konten HTML (untuk excerpt). */
function firstParagraph(html: string): string {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  const raw = m ? m[1] : html
  return raw.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

const SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  featured_image_url: true,
  published_at: true,
  author_name: true,
  author_image_url: true,
  view_count: true,
  content: true,
  category: { select: { name: true } },
} as const

type Row = {
  content: string
  [k: string]: unknown
}

function toPublic(rows: Row[]): PublicArticle[] {
  return rows.map(({ content, ...a }) => ({
    ...(a as Omit<PublicArticle, 'reading_time'>),
    excerpt: firstParagraph(content) || (a as { excerpt?: string | null }).excerpt || null,
    reading_time: readingTimeMinutes(content),
  }))
}

/** Artikel terbaru (bento). */
export const getLatestArticles = cache(async (take = 5): Promise<PublicArticle[]> => {
  try {
    const rows = await prisma.article.findMany({
      where: { status: 'PUBLISHED', deleted_at: null },
      select: SELECT,
      orderBy: { published_at: 'desc' },
      take,
    })
    return toPublic(rows as Row[])
  } catch {
    return []
  }
})

/** Artikel terpopuler (view terbanyak; tie-break terbaru). */
export const getPopularArticles = cache(async (take = 8): Promise<PublicArticle[]> => {
  try {
    const rows = await prisma.article.findMany({
      where: { status: 'PUBLISHED', deleted_at: null },
      select: SELECT,
      orderBy: [{ view_count: 'desc' }, { published_at: 'desc' }],
      take,
    })
    return toPublic(rows as Row[])
  } catch {
    return []
  }
})

export type PublicArticleDetail = PublicArticle & {
  content: string
  tags: string[]
  featured_image_caption?: string | null
}

/** Detail artikel by slug (published). */
export const getArticleBySlug = cache(async (slug: string): Promise<PublicArticleDetail | null> => {
  try {
    const a = await prisma.article.findFirst({
      where: { slug, status: 'PUBLISHED', deleted_at: null },
      select: { ...SELECT, featured_image_caption: true, tags: { select: { name: true } } },
    })
    if (!a) {
      // Fallback: slug cocok dengan data dummy → detail sintetis (excerpt jadi konten).
      const fb = ARTICLE_FALLBACK.find((f) => f.slug === slug)
      if (fb) return { ...fb, content: `<p>${fb.excerpt ?? ''}</p>`, tags: [] }
      return null
    }
    const { content, tags, ...rest } = a as Row & { tags: { name: string }[] }
    return {
      ...(rest as Omit<PublicArticleDetail, 'reading_time' | 'content' | 'tags'>),
      content,
      reading_time: readingTimeMinutes(content),
      tags: tags.map((t) => t.name),
    }
  } catch {
    return null
  }
})

/** Artikel terkait (kategori sama, exclude current); fallback terbaru. */
export const getRelatedArticles = cache(
  async (categoryName: string | null, excludeId: string, take = 3): Promise<PublicArticle[]> => {
    try {
      const base = { status: 'PUBLISHED' as const, deleted_at: null, id: { not: excludeId } }
      const rows = await prisma.article.findMany({
        where: categoryName ? { ...base, category: { name: categoryName } } : base,
        select: SELECT,
        orderBy: { published_at: 'desc' },
        take,
      })
      if (rows.length < take) {
        const more = await prisma.article.findMany({
          where: { ...base, id: { notIn: [excludeId, ...rows.map((r) => r.id as string)] } },
          select: SELECT,
          orderBy: { published_at: 'desc' },
          take: take - rows.length,
        })
        return toPublic([...rows, ...more] as Row[])
      }
      return toPublic(rows as Row[])
    } catch {
      return []
    }
  }
)

/** Increment view count (fire-and-forget dari detail page). */
export async function incrementArticleView(id: string): Promise<void> {
  try {
    await prisma.article.update({ where: { id }, data: { view_count: { increment: 1 } } })
  } catch {
    // abaikan; view count non-kritis
  }
}

/** Semua artikel publik (untuk daftar + pagination client). */
export const getAllPublicArticles = cache(async (): Promise<PublicArticle[]> => {
  try {
    const rows = await prisma.article.findMany({
      where: { status: 'PUBLISHED', deleted_at: null },
      select: SELECT,
      orderBy: { published_at: 'desc' },
    })
    return toPublic(rows as Row[])
  } catch {
    return []
  }
})

/** Fallback dummy saat CMS belum ada data. */
export const ARTICLE_FALLBACK: PublicArticle[] = [
  { id: 'fa1', title: 'Membumikan Nilai Dasar Perjuangan (NDP) di Era Digital', slug: 'ndp-era-digital', excerpt: 'Menelaah relevansi teks ideologis HMI dalam menjawab disrupsi teknologi dan pergeseran paradigma generasi Z.', featured_image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80', published_at: new Date('2026-06-15'), author_name: 'Redaksi HMI', author_image_url: null, reading_time: 5, view_count: 0, category: { name: 'Kajian' } },
  { id: 'fa2', title: 'Gagasan Islam Progresif', slug: 'gagasan-islam-progresif', excerpt: 'Membangun narasi keislaman yang inklusif dan adaptif terhadap kemajuan zaman.', featured_image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80', published_at: new Date('2026-06-10'), author_name: 'Redaksi HMI', author_image_url: null, reading_time: 3, view_count: 0, category: { name: 'Keislaman' } },
  { id: 'fa3', title: 'Kaderisasi & Tantangan Zaman', slug: 'kaderisasi-tantangan-zaman', excerpt: 'Merefleksikan arah pengkaderan HMI di tengah perubahan lanskap sosial dan teknologi.', featured_image_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&q=80', published_at: new Date('2026-06-05'), author_name: 'Redaksi HMI', author_image_url: null, reading_time: 4, view_count: 0, category: { name: 'Kaderisasi' } },
  { id: 'fa4', title: 'Peran Mahasiswa dalam Advokasi Kebijakan Publik', slug: 'advokasi-kebijakan-publik', excerpt: 'Menyoroti kontribusi gerakan mahasiswa dalam mengawal kebijakan publik yang berpihak pada rakyat.', featured_image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80', published_at: new Date('2026-05-28'), author_name: 'Redaksi HMI', author_image_url: null, reading_time: 4, view_count: 0, category: { name: 'Berita' } },
  { id: 'fa5', title: 'Refleksi Hari Lahir HMI', slug: 'refleksi-hari-lahir-hmi', excerpt: 'Meneguhkan kembali komitmen kaderisasi dan pengabdian di momentum milad HMI.', featured_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80', published_at: new Date('2026-05-20'), author_name: 'Redaksi HMI', author_image_url: null, reading_time: 2, view_count: 0, category: { name: 'Opini' } },
  { id: 'fa6', title: 'Meneguhkan Independensi Etis Kader', slug: 'independensi-etis-kader', excerpt: 'Refleksi atas prinsip independensi HMI dalam dinamika politik kampus dan nasional.', featured_image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80', published_at: new Date('2026-05-12'), author_name: 'Redaksi HMI', author_image_url: null, reading_time: 3, view_count: 0, category: { name: 'Opini' } },
]
