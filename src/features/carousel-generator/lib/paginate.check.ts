/**
 * Runnable self-check for the slice planner (no test framework). Run: `npx tsx <this file>`.
 * Guards: slices tile the column contiguously to the end, no boundary cuts inside an image,
 * and the slide cap holds.
 */
import { planSlices, totalSlides, MAX_SLIDES } from './paginate'

let failures = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failures++
    console.error('✗', msg)
  } else {
    console.log('✓', msg)
  }
}

// Contiguous tiling with no images: cover budget then body budgets, ending exactly at totalHeight.
{
  const { slices, truncated } = planSlices(3000, 800, 1350, [])
  assert(slices[0].start === 0 && slices[0].end === 800, 'first slice uses the cover budget')
  assert(slices[slices.length - 1].end === 3000, 'last slice ends at totalHeight')
  for (let i = 1; i < slices.length; i++) assert(slices[i].start === slices[i - 1].end, 'slices are contiguous')
  assert(!truncated, 'not truncated for a short column')
}

// Image straddling a boundary → cut at the image top (image not split).
{
  // cover 800, body 1350: 2nd boundary would be 800+1350=2150; image [2000,2400] straddles it.
  const { slices } = planSlices(3000, 800, 1350, [[2000, 2400]])
  const boundaries = slices.map((s) => s.end)
  assert(boundaries.includes(2000), 'boundary pulled up to the image top (2000)')
  for (const [t, b] of [[2000, 2400]] as Array<[number, number]>) {
    assert(!boundaries.some((e) => e > t && e < b && e !== 3000), 'no boundary lands inside the image')
  }
}

// Line snapping: boundary pulls DOWN to the nearest line bottom so no line is bisected.
{
  // cover budget 800; line bottoms every 100px. Target 800 → snap to 800 (exact line). Next target
  // 800+1000=1800 → snap to 1800.
  const lines = Array.from({ length: 40 }, (_, i) => (i + 1) * 100) // 100..4000
  const { slices } = planSlices(4000, 800, 1000, [], lines)
  for (const s of slices) {
    assert(s.end === 4000 || lines.includes(s.end), `slice end ${s.end} lands on a line boundary`)
  }
  assert(slices[0].end === 800, 'cover snaps to a line boundary at/under its budget')
}

// Line snapping with an off-grid budget snaps below, never above.
{
  const lines = [100, 250, 500, 900, 1400]
  const { slices } = planSlices(1400, 640, 640, [], lines)
  assert(slices[0].end === 500, 'budget 640 snaps down to 500 (largest line ≤ 640)')
}

// Image taller than a slide starting at slice top is rendered as-is (documented ceiling), progress kept.
{
  const { slices } = planSlices(4000, 1350, 1350, [[0, 2000]])
  assert(slices.length > 0 && slices[0].end > 0, 'progress made even with an oversized leading image')
}

// Slide cap enforced (content slices + CTA ≤ MAX_SLIDES).
{
  const { slices, truncated } = planSlices(100000, 1350, 1350, [])
  assert(slices.length === MAX_SLIDES - 1, `content slices capped at ${MAX_SLIDES - 1}`)
  assert(totalSlides(slices.length) === MAX_SLIDES, `total slides = ${MAX_SLIDES}`)
  assert(truncated, 'truncated flag set when capped')
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`)
  process.exit(1)
}
console.log('\nAll slice-planner checks passed.')
