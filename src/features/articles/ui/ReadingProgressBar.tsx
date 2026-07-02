'use client'

import { useEffect, useState } from 'react'

/** Garis tipis progres baca di paling atas (mengikuti scroll). */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent">
      <div className="h-full bg-primary transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
    </div>
  )
}
