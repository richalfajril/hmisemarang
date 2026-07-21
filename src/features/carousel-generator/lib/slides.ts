/**
 * Imperative DOM builders for the three carousel slide types (cover / body / CTA).
 * Built as real DOM (not React) so `html-to-image` rasterizes a deterministic, fully-laid-out
 * node. Content slides show a vertical SLICE of one rendered body column (see ./render.ts): the
 * column is cloned per slide and translated up by `slice.start`, then clipped to the slice height,
 * so text may be cut mid-block (intended) while images fall on slice boundaries and stay whole.
 */
import { SLIDE_W, SLIDE_H, HEADER_H } from './paginate'

export const SLIDE_PAD = 60
export const CONTENT_W = SLIDE_W - SLIDE_PAD * 2 // 960
/** Body font size for the article column (user decision v1.1; +4 in v1.2). */
export const BODY_FONT_PX = 24
const BRAND = '#047857' // emerald-700, same accent used on the website

/**
 * Exact prose class string reused from ArticleReadingView so every arbitrary Tailwind token is
 * already present in the compiled CSS bundle. Keep in sync if the reading view's prose changes.
 */
export const PROSE_CLASS =
  'prose prose-emerald max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-0 prose-h3:text-xl prose-a:text-primary prose-img:rounded-xl'

function div(css: string, className = ''): HTMLDivElement {
  const d = document.createElement('div')
  d.style.cssText = css
  if (className) d.className = className
  return d
}

/** Base 1080×1350 white slide with the site sans font. */
function newRoot(): HTMLDivElement {
  return div(
    `position:relative;width:${SLIDE_W}px;height:${SLIDE_H}px;background:#ffffff;` +
      `overflow:hidden;box-sizing:border-box;font-family:var(--font-sans),system-ui,sans-serif;color:#0a0a0a;`,
  )
}

/** Bottom-right page indicator (may overlap sliced content — accepted per user). */
function addIndicator(root: HTMLElement, index: number, total: number): void {
  const ind = div('position:absolute;right:40px;bottom:32px;font-size:22px;font-weight:600;color:#64748b;z-index:2;')
  ind.textContent = `${index}/${total}`
  root.appendChild(ind)
}

/**
 * A fixed-height clip window onto the body column: horizontal padding + the cloned column
 * translated up by `start`, vertically clipped to `height`. Text cuts at top/bottom are intended;
 * `height` equals the slice height so an image-forced short slice leaves whitespace, never a
 * partial image.
 */
function clip(colClone: HTMLElement, start: number, height: number): HTMLDivElement {
  const window_ = div(`position:relative;width:${CONTENT_W}px;height:${height}px;overflow:hidden;`)
  colClone.style.transform = `translateY(-${start}px)`
  colClone.style.width = `${CONTENT_W}px`
  window_.appendChild(colClone)
  return window_
}

// ---- Share icons (static brand glyphs, matching the article detail row) --------------------
function iconCircle(viewBox: string, path: string): HTMLDivElement {
  const c = div(
    'display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:9999px;border:1px solid #e2e8f0;background:#ffffff;',
  )
  c.innerHTML = `<svg viewBox="${viewBox}" width="24" height="24" fill="#64748b" xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`
  return c
}
const SHARE_ICONS: Array<[string, string]> = [
  // WhatsApp
  ['0 0 448 512', 'M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.2-157zM223.9 438.7c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z'],
  // X (Twitter)
  ['0 0 512 512', 'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l165-188.8L26.8 48h145.6l100.5 132.9L389.2 48zm-24.8 373.8h39.1L151.1 88h-42l255.3 333.8z'],
  // Facebook
  ['0 0 320 512', 'M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z'],
  // Link
  ['0 0 640 512', 'M579.8 267.7c56.5-56.5 56.5-148 0-204.5-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6 31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5 50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C81.8 372 81.8 321 113.3 289.6L225.7 177.2c31.5-31.5 82.5-31.5 114 0 27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z'],
]

export interface CoverMeta {
  headerDataUrl: string
  category?: string | null
  title: string
  authorName?: string | null
  authorImageDataUrl?: string | null
  dateStr?: string | null
  readingMin: number
  viewCount?: number | null
  coverDataUrl?: string | null
  featuredImageCaption?: string | null
}

/**
 * The cover's fixed area: IG header band + category + title + author/meta row (avatar, date,
 * reading time, views, share icons — like the article detail) + cover image. Built separately so
 * its measured height derives how much body fits below.
 */
export function buildCoverFixed(meta: CoverMeta): HTMLDivElement {
  const wrap = div('display:flex;flex-direction:column;')

  const header = document.createElement('img')
  header.src = meta.headerDataUrl
  header.style.cssText = `width:${SLIDE_W}px;height:${HEADER_H}px;object-fit:cover;display:block;`
  wrap.appendChild(header)

  // Bottom padding = jarak figcaption/cover-image → awal body (½ dari 60px, v1.2).
  const pad = div(`padding:0 ${SLIDE_PAD}px 30px;display:flex;flex-direction:column;gap:20px;`)

  if (meta.category) {
    const pill = div(
      `align-self:flex-start;background:#d1fae5;color:${BRAND};font-size:20px;font-weight:700;padding:8px 20px;border-radius:9999px;`,
    )
    pill.textContent = meta.category
    pad.appendChild(pill)
  }

  const h1 = document.createElement('h1')
  h1.style.cssText = 'font-size:50px;line-height:1.15;font-weight:800;letter-spacing:-0.02em;margin:0;color:#0a0a0a;'
  h1.textContent = meta.title
  pad.appendChild(h1)

  // Author + meta + share row (border-y like the detail page).
  const row = div(
    'display:flex;align-items:center;gap:20px;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;padding:22px 0;',
  )

  const avatar = div(
    `position:relative;width:64px;height:64px;flex-shrink:0;border-radius:9999px;overflow:hidden;background:#d1fae5;` +
      `display:flex;align-items:center;justify-content:center;color:${BRAND};font-weight:700;font-size:26px;`,
  )
  if (meta.authorImageDataUrl) {
    const av = document.createElement('img')
    av.src = meta.authorImageDataUrl
    av.style.cssText = 'width:100%;height:100%;object-fit:cover;'
    avatar.appendChild(av)
  } else {
    avatar.textContent = (meta.authorName ?? '?').charAt(0).toUpperCase()
  }
  row.appendChild(avatar)

  const info = div('display:flex;flex-direction:column;gap:6px;margin-right:auto;')
  const name = div('font-size:26px;font-weight:700;color:#0a0a0a;')
  name.textContent = meta.authorName ?? 'Anonim'
  info.appendChild(name)
  const metaBits = [
    meta.dateStr || null,
    `${meta.readingMin} min`,
    typeof meta.viewCount === 'number' ? `${meta.viewCount} dilihat` : null,
  ].filter(Boolean)
  const sub = div('font-size:22px;color:#64748b;')
  sub.textContent = metaBits.join('  ·  ')
  info.appendChild(sub)
  row.appendChild(info)

  const share = div('display:flex;align-items:center;gap:14px;flex-shrink:0;')
  for (const [vb, p] of SHARE_ICONS) share.appendChild(iconCircle(vb, p))
  row.appendChild(share)

  pad.appendChild(row)

  if (meta.coverDataUrl) {
    const fig = document.createElement('img')
    fig.src = meta.coverDataUrl
    fig.style.cssText = `width:${CONTENT_W}px;height:${Math.round((CONTENT_W * 9) / 16)}px;object-fit:cover;border-radius:16px;display:block;`
    pad.appendChild(fig)
    if (meta.featuredImageCaption) {
      const cap = div('margin-top:-4px;text-align:center;font-size:20px;font-style:italic;color:#64748b;')
      cap.textContent = meta.featuredImageCaption
      pad.appendChild(cap)
    }
  }

  wrap.appendChild(pad)
  return wrap
}

/** Assemble the cover: fixed area + a clipped body slice + indicator. */
export function buildCover(
  fixed: HTMLElement,
  colClone: HTMLElement,
  sliceHeight: number,
  index: number,
  total: number,
): HTMLDivElement {
  // Flex column with a guaranteed 60px bottom padding: the body region takes exactly the remaining
  // space (self-correcting for any cover-height mismeasure) and clips its content — so body text can
  // never breach the bottom padding. `sliceHeight` (snapped to a line) keeps the last line whole.
  const root = newRoot()
  root.style.display = 'flex'
  root.style.flexDirection = 'column'
  root.style.paddingBottom = `${SLIDE_PAD}px`
  root.appendChild(fixed)
  if (sliceHeight > 0) {
    const region = div(`flex:1 1 auto;min-height:0;overflow:hidden;padding:0 ${SLIDE_PAD}px;`)
    region.appendChild(clip(colClone, 0, sliceHeight))
    root.appendChild(region)
  }
  addIndicator(root, index, total)
  return root
}

/** A body slide: a clipped body slice (maximized) + indicator. */
export function buildBody(
  colClone: HTMLElement,
  start: number,
  sliceHeight: number,
  index: number,
  total: number,
): HTMLDivElement {
  const root = newRoot()
  const window_ = div(`padding:${SLIDE_PAD}px;`) // 60px top/bottom/left/right on normal slides
  window_.appendChild(clip(colClone, start, sliceHeight))
  root.appendChild(window_)
  addIndicator(root, index, total)
  return root
}

/** The final CTA slide: header band on top (so it isn't empty) + centered QR block in the rest. */
export function buildCta(
  headerDataUrl: string,
  title: string,
  qrDataUrl: string,
  articleUrl: string,
  index: number,
  total: number,
): HTMLDivElement {
  // Root is the flex column (like buildCover): header fixed, content area flex:1 fills the rest.
  // Relying on flex:1 (not an explicit child height) survives html-to-image, which collapses
  // explicit-height children and would kill the space-evenly distribution.
  const root = newRoot()
  root.style.display = 'flex'
  root.style.flexDirection = 'column'

  const header = document.createElement('img')
  header.src = headerDataUrl
  header.style.cssText = `width:${SLIDE_W}px;height:${HEADER_H}px;object-fit:cover;display:block;flex:0 0 auto;`
  root.appendChild(header)

  // Content area fills the remaining height; three groups evenly spaced (judul / QR / caption+URL).
  const center = div(
    `flex:1 1 auto;min-height:0;display:flex;flex-direction:column;align-items:center;` +
      `justify-content:space-evenly;text-align:center;padding:0 ${SLIDE_PAD}px;box-sizing:border-box;`,
  )

  // Group A: kicker + title
  const groupA = div('display:flex;flex-direction:column;align-items:center;gap:16px;')
  const kicker = div(`font-size:24px;font-weight:800;letter-spacing:0.12em;color:${BRAND};`)
  kicker.textContent = 'BACA SELENGKAPNYA'
  const h2 = document.createElement('h2')
  h2.style.cssText = 'font-size:38px;line-height:1.25;font-weight:700;margin:0;color:#0a0a0a;'
  h2.textContent = title
  groupA.append(kicker, h2)

  // Group B: QR (+100px → 520)
  const qr = document.createElement('img')
  qr.src = qrDataUrl
  qr.style.cssText = 'width:520px;height:520px;display:block;'

  // Group C: caption + site
  const groupC = div('display:flex;flex-direction:column;align-items:center;gap:12px;')
  const caption = div('font-size:26px;color:#64748b;line-height:1.4;')
  caption.textContent = 'Scan QR Code untuk membaca artikel lengkap.'
  // URL artikel penuh (sama dengan tujuan QR); word-break agar slug panjang membungkus rapi.
  const site = div(`font-size:24px;font-weight:800;color:${BRAND};word-break:break-word;line-height:1.3;`)
  site.textContent = articleUrl
  groupC.append(caption, site)

  center.append(groupA, qr, groupC)
  root.appendChild(center)
  addIndicator(root, index, total)
  return root
}
