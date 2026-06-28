'use client'

import { useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Item = {
  id: string
  name: string
  slug: string
  logo_url: string | null
}

const SPEED = 0.5

export function CommissariatCarousel({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const s = useRef({ x: 0, paused: false, dragging: false, startX: 0, startOffset: 0 })
  const rafRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const tick = () => {
      const state = s.current
      if (!state.dragging && !state.paused) {
        state.x -= SPEED
        const half = track.scrollWidth / 2
        if (state.x < -half) state.x += half
        track.style.transform = `translateX(${state.x}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const startDrag = useCallback((x: number) => {
    s.current.dragging = true
    s.current.startX = x
    s.current.startOffset = s.current.x
  }, [])

  const moveDrag = useCallback((x: number) => {
    if (!s.current.dragging || !trackRef.current) return
    s.current.x = s.current.startOffset + (x - s.current.startX)
    trackRef.current.style.transform = `translateX(${s.current.x}px)`
  }, [])

  const endDrag = useCallback(() => {
    if (!trackRef.current) return
    s.current.dragging = false
    const half = trackRef.current.scrollWidth / 2
    while (s.current.x < -half) s.current.x += half
    while (s.current.x > 0) s.current.x -= half
  }, [])

  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseEnter={() => { s.current.paused = true }}
      onMouseLeave={() => { s.current.paused = false; endDrag() }}
      onMouseDown={(e) => startDrag(e.clientX)}
      onMouseMove={(e) => moveDrag(e.clientX)}
      onMouseUp={() => endDrag()}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchMove={(e) => { e.preventDefault(); moveDrag(e.touches[0].clientX) }}
      onTouchEnd={() => endDrag()}
    >
      <div
        ref={trackRef}
        className="flex select-none gap-3"
        style={{ width: 'max-content' }}
      >
        {doubled.map((c, i) => (
          <Link
            key={`${c.id}-${i}`}
            href={`/komisariat/${c.slug}`}
            className="flex w-64 items-center gap-3 opacity-90 hover:opacity-100"
            onClick={(e) => { if (s.current.dragging) e.preventDefault() }}
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/20">
              {c.logo_url ? (
                <Image src={c.logo_url} alt={c.name} fill className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                  {c.name.charAt(0)}
                </span>
              )}
            </div>
            <span className="whitespace-nowrap text-sm font-bold text-white">{c.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
