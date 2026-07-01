'use client'

import { useRef, useEffect, useState } from 'react'
import { cn } from '@/shared/lib/utils'

type Props = {
  className?: string
  /** Delay in ms before the reveal transition starts. */
  delay?: number
  children: React.ReactNode
}

/**
 * Reveals children with a fade-up transition the first time they enter the
 * viewport (scroll down), then stays visible — no re-animate on scroll up.
 * Reusable across public pages.
 */
export function FadeIn({ className, delay = 0, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Reveal sekali: muncul saat masuk viewport (scroll turun), tetap
        // tampil saat scroll naik — tidak re-animate.
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition-all duration-[600ms] ease-out motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-[50px] opacity-0',
        className
      )}
    >
      {children}
    </div>
  )
}
