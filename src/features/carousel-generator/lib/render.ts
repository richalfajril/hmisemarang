/**
 * Client-side carousel render pipeline: render the article body into one tall column → plan pixel
 * slices (maximized, images never split) → compose 1080×1350 slides → rasterize with html-to-image
 * → zip. Runs entirely in the admin's browser. Remote images are inlined as data URLs so the canvas
 * is never tainted and heights measure correctly.
 */
import * as htmlToImage from 'html-to-image'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import { SLIDE_W, SLIDE_H, planSlices, totalSlides } from './paginate'
import { CONTENT_W, SLIDE_PAD, BODY_FONT_PX, PROSE_CLASS, buildCoverFixed, buildCover, buildBody, buildCta } from './slides'

export interface CarouselInput {
  title: string
  slug: string
  content: string // article HTML (Tiptap output)
  categoryName?: string | null
  authorName?: string | null
  authorImageUrl?: string | null
  dateStr?: string | null
  viewCount?: number | null
  featuredImageUrl?: string | null
  featuredImageCaption?: string | null
  headerUrl: string
}

export interface GeneratedSlide {
  name: string // 01.png, 02.png, …
  blob: Blob
  url: string // object URL for preview (caller must revoke on close)
}

const SITE_ORIGIN = 'https://hmisemarang.org'
/** News-style dateline prepended to the body, matching ArticleReadingView. */
const DATELINE = `<strong style="color:#047857">SEMARANG, hmisemarang.org</strong> — `

/** Estimated reading time (min) from HTML, ~200 wpm — same formula as the public reading view. */
function readingTimeMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function withDateline(content: string): string {
  return /<p[\s>]/i.test(content)
    ? content.replace(/<p(\s[^>]*)?>/i, (m) => m + DATELINE)
    : `<p>${DATELINE}${content}</p>`
}

/** Fetch a remote image and return it as a data URL (CORS-safe embedding for html-to-image). */
async function toDataUrl(url: string): Promise<string> {
  const res = await fetch(url, { mode: 'cors', cache: 'no-store' })
  const blob = await res.blob()
  return await new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result as string)
    fr.onerror = reject
    fr.readAsDataURL(blob)
  })
}

/** Inline every <img> in a container to a data URL and wait for decode (best-effort per image). */
async function inlineImages(container: HTMLElement): Promise<void> {
  await Promise.all(
    Array.from(container.querySelectorAll('img')).map(async (img) => {
      try {
        if (!img.src.startsWith('data:')) img.src = await toDataUrl(img.src)
        await img.decode().catch(() => {})
      } catch {
        img.crossOrigin = 'anonymous'
      }
    }),
  )
}

/**
 * Y-positions (relative to column top) where a horizontal cut keeps text whole: the bottom of every
 * text line box (via Range.getClientRects) plus image/figure bottoms. Sorted ascending, deduped.
 */
function cutPoints(col: HTMLElement): number[] {
  const colTop = col.getBoundingClientRect().top
  const points = new Set<number>()
  const range = document.createRange()
  const walker = document.createTreeWalker(col, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    if (!node.textContent || !node.textContent.trim()) continue
    range.selectNodeContents(node)
    const rects = range.getClientRects()
    for (let i = 0; i < rects.length; i++) points.add(Math.round(rects[i].bottom - colTop))
  }
  col.querySelectorAll('img, figure').forEach((el) => {
    points.add(Math.round(el.getBoundingClientRect().bottom - colTop))
  })
  return Array.from(points).sort((a, b) => a - b)
}

/** [top, bottom] px ranges (relative to column top) of images — boundaries must not cut inside. */
function imageZones(col: HTMLElement): Array<[number, number]> {
  const colTop = col.getBoundingClientRect().top
  const units = new Set<HTMLElement>()
  col.querySelectorAll('img').forEach((img) => units.add((img.closest('figure') as HTMLElement) || img))
  return Array.from(units)
    .map((el): [number, number] => {
      const r = el.getBoundingClientRect()
      const top = r.top - colTop
      return [top, top + r.height]
    })
    .sort((a, b) => a[0] - b[0])
}

async function rasterize(node: HTMLElement): Promise<Blob> {
  await Promise.all(Array.from(node.querySelectorAll('img')).map((img) => img.decode().catch(() => {})))
  const blob = await htmlToImage.toBlob(node, {
    width: SLIDE_W,
    height: SLIDE_H,
    pixelRatio: 1, // exact 1080×1350 output regardless of screen DPR
    backgroundColor: '#ffffff',
  })
  if (!blob) throw new Error('Rasterisasi slide gagal.')
  return blob
}

/**
 * Generate all carousel slides. `onProgress(done, total)` fires after each slide is rasterized.
 * The offscreen host is always removed, even on error.
 */
export async function generateCarousel(
  input: CarouselInput,
  onProgress?: (done: number, total: number) => void,
): Promise<GeneratedSlide[]> {
  const host = document.createElement('div')
  host.style.cssText = 'position:absolute;left:-99999px;top:0;background:#ffffff;'
  document.body.appendChild(host)

  try {
    // Fonts must be ready BEFORE any measurement, else line/height measurements (cover fixed area,
    // cut points) use fallback metrics and mismatch the rasterized (webfont) output.
    if (document.fonts?.ready) await document.fonts.ready

    // Assets: QR + header/cover/author images as data URLs (parallel).
    const [qrDataUrl, headerDataUrl, coverDataUrl, authorDataUrl] = await Promise.all([
      QRCode.toDataURL(`${SITE_ORIGIN}/artikel/${input.slug}`, { width: 420, margin: 1 }),
      toDataUrl(input.headerUrl),
      input.featuredImageUrl ? toDataUrl(input.featuredImageUrl) : Promise.resolve(null),
      input.authorImageUrl ? toDataUrl(input.authorImageUrl).catch(() => null) : Promise.resolve(null),
    ])

    // Body column: full article at 20px, with dateline; same width/prose as on-slide.
    const col = document.createElement('div')
    col.className = `${PROSE_CLASS} carousel-prose`
    col.style.cssText = `width:${CONTENT_W}px;font-size:${BODY_FONT_PX}px;`
    col.innerHTML = withDateline(input.content)
    host.appendChild(col)
    await inlineImages(col)
    const totalHeight = col.offsetHeight
    const zones = imageZones(col)
    const lines = cutPoints(col)

    // Cover fixed area → measure to derive the cover's body budget.
    const coverFixed = buildCoverFixed({
      headerDataUrl,
      category: input.categoryName,
      title: input.title,
      authorName: input.authorName,
      authorImageDataUrl: authorDataUrl,
      dateStr: input.dateStr,
      readingMin: readingTimeMinutes(input.content),
      viewCount: input.viewCount,
      coverDataUrl,
      featuredImageCaption: input.featuredImageCaption,
    })
    host.appendChild(coverFixed)
    // Reserve 60px at the slide bottom so cover body text doesn't run to the edge/indicator (v1.2).
    // buildCover also enforces this 60px via flex + padding-bottom, so a small mismeasure can't nerobos.
    const coverBudget = Math.max(200, SLIDE_H - Math.ceil(coverFixed.getBoundingClientRect().height) - 60)
    const bodyBudget = SLIDE_H - SLIDE_PAD * 2 // body slides have 60px top & bottom padding

    const { slices } = planSlices(totalHeight, coverBudget, bodyBudget, zones, lines)
    const total = totalSlides(slices.length)

    // Compose slides (clone the column per slice; translate + clip in the builder).
    const nodes: HTMLElement[] = []
    slices.forEach((s, i) => {
      const cloneCol = col.cloneNode(true) as HTMLElement
      const height = s.end - s.start
      nodes.push(
        i === 0
          ? buildCover(coverFixed, cloneCol, height, 1, total)
          : buildBody(cloneCol, s.start, height, i + 1, total),
      )
    })
    nodes.push(buildCta(headerDataUrl, input.title, qrDataUrl, total, total))

    // Rasterize sequentially (progress + lower peak memory).
    const out: GeneratedSlide[] = []
    for (let i = 0; i < nodes.length; i++) {
      host.appendChild(nodes[i])
      const blob = await rasterize(nodes[i])
      out.push({ name: `${String(i + 1).padStart(2, '0')}.png`, blob, url: URL.createObjectURL(blob) })
      onProgress?.(i + 1, total)
    }
    return out
  } finally {
    host.remove()
  }
}

/** Bundle slides into `{slug}.zip` (01.png, 02.png, …). */
export async function buildZip(slides: GeneratedSlide[]): Promise<Blob> {
  const zip = new JSZip()
  for (const s of slides) zip.file(s.name, s.blob)
  return await zip.generateAsync({ type: 'blob' })
}

/** Trigger a browser download for a blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
