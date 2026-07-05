'use client'

import { useRef, useEffect, useCallback } from 'react'
import { ArticleCard } from './ArticleCard'
import { useHorizontalWheel } from '@/shared/lib/hooks/useHorizontalWheel'
import type { PublicArticle } from '../api/public-queries'

const SPEED = 0.4

export function PopularCarousel({ articles }: { articles: PublicArticle[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const s = useRef({ x: 0, paused: false, dragging: false, moved: false, startX: 0, startOffset: 0 })
  const rafRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const tick = () => {
      const st = s.current
      if (!st.dragging && !st.paused) {
        st.x -= SPEED
        const half = track.scrollWidth / 2
        if (st.x < -half) st.x += half
        track.style.transform = `translateX(${st.x}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const startDrag = useCallback((x: number) => {
    s.current.dragging = true
    s.current.moved = false
    s.current.startX = x
    s.current.startOffset = s.current.x
  }, [])
  const moveDrag = useCallback((x: number) => {
    if (!s.current.dragging || !trackRef.current) return
    if (Math.abs(x - s.current.startX) > 4) s.current.moved = true
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
  const wheelMove = useCallback((dx: number) => {
    const track = trackRef.current
    if (!track) return
    s.current.x -= dx
    const half = track.scrollWidth / 2
    while (s.current.x < -half) s.current.x += half
    while (s.current.x > 0) s.current.x -= half
    track.style.transform = `translateX(${s.current.x}px)`
  }, [])
  useHorizontalWheel(containerRef, wheelMove)

  if (articles.length === 0) return null
  const doubled = [...articles, ...articles]

  return (
    <div
      ref={containerRef}
      className="cursor-grab overflow-hidden active:cursor-grabbing"
      onMouseEnter={() => { s.current.paused = true }}
      onMouseLeave={() => { s.current.paused = false; endDrag() }}
      onMouseDown={(e) => startDrag(e.clientX)}
      onMouseMove={(e) => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
      onClickCapture={(e) => { if (s.current.moved) { e.preventDefault(); e.stopPropagation() } }}
    >
      <div ref={trackRef} className="flex select-none gap-6 py-2" style={{ width: 'max-content' }}>
        {doubled.map((a, i) => (
          <div key={`${a.id}-${i}`} className="w-80 shrink-0">
            <ArticleCard article={a} />
          </div>
        ))}
      </div>
    </div>
  )
}
