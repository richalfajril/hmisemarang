import { useEffect, type RefObject } from 'react'

/**
 * Swipe/scroll horizontal (trackpad kiri-kanan atau Shift+wheel) di atas elemen →
 * panggil onDelta(dx). Cegah navigasi back/forward browser. onDelta harus stabil (useCallback).
 */
export function useHorizontalWheel(
  ref: RefObject<HTMLElement | null>,
  onDelta: (dx: number) => void
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      // Hanya tangani gerak horizontal dominan; wheel vertikal biasa dibiarkan (scroll halaman).
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0
      if (!dx) return
      e.preventDefault()
      onDelta(dx)
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [ref, onDelta])
}
