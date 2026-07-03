'use server'

import { prisma } from '@/shared/api/prisma/client'
import { getUserSession } from '@/shared/api/supabase/server'
import { listCloudinaryImages } from '@/shared/lib/cloudinary'

const GRACE_DAYS = 7 // aset lebih baru dari ini di-skip (cegah hapus upload baru)

export type OrphanReport = {
  ok: boolean
  message?: string
  totalAssets: number
  referenced: number
  orphans: { public_id: string; secure_url: string; bytes: number; created_at: string }[]
  orphanBytes: number
  skippedRecent: number
}

/** Ekstrak public_id dari URL Cloudinary (buang versi & ekstensi). */
function extractPublicId(url: string | null | undefined): string | null {
  if (!url) return null
  const i = url.indexOf('/upload/')
  if (i === -1) return null
  let rest = url.slice(i + 8).replace(/^v\d+\//, '')
  rest = rest.replace(/\.[a-z0-9]+$/i, '')
  return rest || null
}

/** Kumpulkan semua public_id yang muncul dalam HTML (gambar inline Tiptap). */
function publicIdsFromHtml(html: string, into: Set<string>) {
  const re = /https?:\/\/[^"'\s)]*\/upload\/[^"'\s)]+/gi
  const m = html.match(re)
  if (m) for (const u of m) {
    const id = extractPublicId(u)
    if (id) into.add(id)
  }
}

/** Scan aset Cloudinary yatim (tidak direferensikan DB). READ-ONLY (tanpa hapus). */
export async function scanOrphanMediaAction(): Promise<OrphanReport> {
  const empty: OrphanReport = { ok: false, totalAssets: 0, referenced: 0, orphans: [], orphanBytes: 0, skippedRecent: 0 }

  const session = await getUserSession()
  if (!session || (session.user.role !== 'SYSTEM_ADMIN' && session.user.role !== 'ADMIN_CABANG')) {
    return { ...empty, message: 'Akses ditolak.' }
  }

  try {
    const referenced = new Set<string>()
    const add = (url: string | null | undefined) => {
      const id = extractPublicId(url)
      if (id) referenced.add(id)
    }

    const [commissariats, submissions, articles, agendas, albums, photos, settings, testimonials] =
      await Promise.all([
        prisma.commissariat.findMany({ select: { logo_url: true, secretariat_photo_url: true } }),
        prisma.commissariatProfileSubmission.findMany({ select: { logo_url: true, secretariat_photo_url: true } }),
        prisma.article.findMany({ select: { featured_image_url: true, author_image_url: true, content: true } }),
        prisma.agenda.findMany({ select: { flyer_url: true, description: true } }),
        prisma.galleryAlbum.findMany({ select: { cover_image_url: true } }),
        prisma.galleryPhoto.findMany({ select: { image_url: true } }),
        prisma.websiteSetting.findMany({
          select: { logo_url: true, favicon_url: true, contact_image_url: true, hero_image_url: true, dark_logo_url: true, about_image_url: true },
        }),
        prisma.testimonial.findMany({ select: { photo_url: true } }),
      ])

    commissariats.forEach((c) => { add(c.logo_url); add(c.secretariat_photo_url) })
    submissions.forEach((s) => { add(s.logo_url); add(s.secretariat_photo_url) })
    articles.forEach((a) => { add(a.featured_image_url); add(a.author_image_url); if (a.content) publicIdsFromHtml(a.content, referenced) })
    agendas.forEach((a) => { add(a.flyer_url); if (a.description) publicIdsFromHtml(a.description, referenced) })
    albums.forEach((a) => add(a.cover_image_url))
    photos.forEach((p) => add(p.image_url))
    settings.forEach((s) => { add(s.logo_url); add(s.favicon_url); add(s.contact_image_url); add(s.hero_image_url); add(s.dark_logo_url); add(s.about_image_url) })
    testimonials.forEach((t) => add(t.photo_url))

    const assets = await listCloudinaryImages()
    const cutoff = Date.now() - GRACE_DAYS * 24 * 60 * 60 * 1000

    let skippedRecent = 0
    const orphans = assets.filter((a) => {
      if (referenced.has(a.public_id)) return false
      if (new Date(a.created_at).getTime() > cutoff) { skippedRecent++; return false }
      return true
    })

    return {
      ok: true,
      totalAssets: assets.length,
      referenced: referenced.size,
      orphans,
      orphanBytes: orphans.reduce((s, o) => s + o.bytes, 0),
      skippedRecent,
    }
  } catch (e) {
    return { ...empty, message: `Gagal scan: ${(e as Error).message}` }
  }
}
