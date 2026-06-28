'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/shared/lib/utils'

// Spec: docs/public-website/homepage/opening-screen.md
const WORDS = ['YAKIN', 'USAHA', 'SAMPAI']

// Module-level guard: cegah StrictMode menjalankan splash dua kali dalam satu
// load. Reset setiap full refresh → splash tampil tiap refresh.
let splashStarted = false

// Timing per spec (~800ms per kata, total ~2.8s)
const WORD_FADE_MS = 300   // durasi fade-in dan fade-out per kata
const WORD_HOLD_MS = 200   // kata tampil penuh sebelum fade-out
const OVERLAY_FADE_MS = 400

// Total durasi splash hingga overlay hilang — dipakai untuk men-stagger animasi
// konten hero agar mulai SETELAH splash selesai.
export const SPLASH_DURATION_MS =
  WORDS.length * (WORD_FADE_MS + WORD_HOLD_MS + WORD_FADE_MS) +
  80 +
  OVERLAY_FADE_MS

/**
 * Opening screen: YAKIN → USAHA → SAMPAI muncul bergantian (fade in/out).
 * Tampil sekali per session (sessionStorage). Reduced-motion: semua kata sekaligus.
 */
export function OpeningSplash() {
  const [show, setShow] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [wordIndex, setWordIndex] = useState(-1)
  const [wordIn, setWordIn] = useState(false)
  const [overlayOut, setOverlayOut] = useState(false)

  useEffect(() => {
    if (splashStarted) return
    splashStarted = true

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true)
    setReducedMotion(prefersReduced)

    const after = (ms: number, fn: () => void) => { setTimeout(fn, ms) }

    const leave = () => {
      setOverlayOut(true)
      after(OVERLAY_FADE_MS, () => setShow(false))
    }

    if (prefersReduced) {
      // Reduced motion: tampil statis 1s lalu fade keluar
      after(1000, leave)
    } else {
      const runWord = (i: number) => {
        setWordIndex(i)
        setWordIn(true)
        // Setelah fade-in + hold → mulai fade-out
        after(WORD_FADE_MS + WORD_HOLD_MS, () => {
          setWordIn(false)
          after(WORD_FADE_MS, () => {
            if (i < WORDS.length - 1) {
              runWord(i + 1)
            } else {
              // Semua kata selesai → overlay fade keluar
              after(80, leave)
            }
          })
        })
      }
      runWord(0)
    }
    // One-shot: timer sengaja tidak di-clear di cleanup agar urutan splash
    // tetap selesai meski StrictMode/Fast-Refresh me-remount komponen.
  }, [])

  if (!show) return null

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={cn(
        'fixed inset-0 z-[60] flex items-center justify-center overflow-hidden transition-opacity',
        overlayOut ? 'pointer-events-none opacity-0' : 'opacity-100'
      )}
      style={{ transitionDuration: `${OVERLAY_FADE_MS}ms` }}
    >
      {/* Emerald gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700" />

      {/* Pola islami geometris halus (bintang berlian bertingkat) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hmi-geo"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            {/* Berlian luar */}
            <path d="M30 3 L57 30 L30 57 L3 30 Z" fill="none" stroke="white" strokeWidth="0.8" />
            {/* Berlian dalam */}
            <path d="M30 15 L45 30 L30 45 L15 30 Z" fill="none" stroke="white" strokeWidth="0.6" />
            {/* Titik tengah */}
            <circle cx="30" cy="30" r="2" fill="none" stroke="white" strokeWidth="0.5" />
            {/* Simpul sudut */}
            <circle cx="0"  cy="0"  r="1.5" fill="white" fillOpacity="0.7" />
            <circle cx="60" cy="0"  r="1.5" fill="white" fillOpacity="0.7" />
            <circle cx="0"  cy="60" r="1.5" fill="white" fillOpacity="0.7" />
            <circle cx="60" cy="60" r="1.5" fill="white" fillOpacity="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hmi-geo)" />
      </svg>

      {/* Konten kata */}
      <div className="relative z-10 select-none text-center">
        {reducedMotion ? (
          // Reduced motion: semua kata sekaligus, statis
          <p className="text-5xl font-extrabold uppercase tracking-widest text-white sm:text-7xl">
            {WORDS.join(' · ')}
          </p>
        ) : (
          // Animasi sequential: satu kata, fade in → fade out
          <span
            className="block text-6xl font-extrabold uppercase leading-none tracking-widest text-white transition-opacity sm:text-8xl lg:text-[12rem]"
            style={{
              opacity: wordIn ? 1 : 0,
              transitionDuration: `${WORD_FADE_MS}ms`,
              minWidth: '5ch',
            }}
          >
            {wordIndex >= 0 ? (WORDS[wordIndex] ?? ' ') : ' '}
          </span>
        )}
      </div>
    </div>
  )
}
