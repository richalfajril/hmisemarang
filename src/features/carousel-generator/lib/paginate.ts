/**
 * Pure slice-planning logic for Generate Carousel — no DOM, no deps, fully unit-testable.
 * Strategy (user decision, v1.1): MAXIMIZE each slide by pixel-slicing the rendered article column
 * at fixed heights — cutting text mid-block/mid-line is fine — EXCEPT never cut through an image;
 * if a slice boundary lands inside an image, cut just above it so the image starts the next slide.
 *
 * DOM measurement + rasterization live in ./render.ts; this file stays platform-free.
 */

/** Instagram carousel slide dimensions (px). */
export const SLIDE_W = 1080
export const SLIDE_H = 1350
/** IG header band height on the cover & CTA slides (spec §10). */
export const HEADER_H = 240
/**
 * Hard cap on total slides = 10: cover (1) + body (2–9, max 8) + CTA/QR (10). If the body needs more
 * than 8 slides it is truncated and closed with the QR slide (user decision, overrides spec BR-007=20).
 */
export const MAX_SLIDES = 10

export interface Slice {
  start: number
  end: number
}

/**
 * Plan the vertical slices of the article body column.
 * @param totalHeight      full rendered height of the body column (px)
 * @param coverBudget      content height available on the cover slide (below header/meta/cover img)
 * @param bodyBudget       content height available on a body slide (≈ full 1350, maximized)
 * @param noCutZones       [top, bottom] px ranges of images (relative to column top); never cut inside
 * @param cutPoints        sorted asc y-positions where a cut keeps lines whole (line-box bottoms +
 *                         image/figure bottoms); the boundary snaps DOWN to the nearest one so no
 *                         text line is ever bisected. Empty → cut exactly at the budget.
 * @param maxContentSlices cover + body slices cap (reserve 1 for the CTA)
 * @returns slices covering [0, totalHeight]; `truncated` when the cap dropped trailing content
 */
export function planSlices(
  totalHeight: number,
  coverBudget: number,
  bodyBudget: number,
  noCutZones: Array<[number, number]>,
  cutPoints: number[] = [],
  maxContentSlices = MAX_SLIDES - 1,
): { slices: Slice[]; truncated: boolean } {
  const slices: Slice[] = []
  let start = 0
  for (let i = 0; i < maxContentSlices && start < totalHeight; i++) {
    const budget = i === 0 ? coverBudget : bodyBudget
    let end = Math.min(start + budget, totalHeight)
    if (end < totalHeight) {
      // If the boundary bisects an image, pull it up to the image's top (image → next slide).
      const zone = noCutZones.find(([t, b]) => end > t && end < b)
      if (zone && zone[0] > start) {
        end = zone[0]
      } else {
        // Otherwise snap DOWN to the nearest line boundary ≤ end so no line is cut in half.
        let snapped = -1
        for (const p of cutPoints) {
          if (p > start && p <= end) snapped = p
          else if (p > end) break
        }
        if (snapped > start) end = snapped
      }
    }
    if (end <= start) end = Math.min(start + budget, totalHeight) // guarantee progress
    slices.push({ start, end })
    start = end
  }
  return { slices, truncated: start < totalHeight }
}

/** Total slide count for a plan (content slides + CTA). */
export function totalSlides(contentSlices: number): number {
  return contentSlices + 1
}
