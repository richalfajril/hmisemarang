'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export type GalleryPhoto = {
  id: string
  image_url: string
  caption: string | null
  album: { title: string } | null
}

// Pola span bento (diulang) untuk variasi ukuran.
const SPANS = ['row-span-2', '', '', 'col-span-2', '', 'row-span-2', 'col-span-2', '']

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
}

export function GalleryBento({ photos }: { photos: GalleryPhoto[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const dragged = useRef(false)
  const [dragConstraint, setDragConstraint] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)

  // Batas area drag horizontal.
  useEffect(() => {
    const calc = () => {
      if (gridRef.current && containerRef.current) {
        const cw = containerRef.current.offsetWidth
        const gw = gridRef.current.scrollWidth
        setDragConstraint(Math.min(0, cw - gw - 32))
      }
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [photos])

  // Scroll reveal.
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start end', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [0, 1, 1, 1])
  const y = useTransform(scrollYProgress, [0, 0.15], [30, 0])

  // Keyboard nav lightbox.
  useEffect(() => {
    if (selected === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
      else if (e.key === 'ArrowRight') setSelected((i) => (i === null ? i : (i + 1) % photos.length))
      else if (e.key === 'ArrowLeft') setSelected((i) => (i === null ? i : (i - 1 + photos.length) % photos.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, photos.length])

  if (photos.length === 0) {
    return (
      <p className="mx-auto max-w-7xl rounded-2xl border border-dashed px-4 py-16 text-center text-sm text-muted-foreground">
        Belum ada foto galeri.
      </p>
    )
  }

  const current = selected !== null ? photos[selected] : null

  return (
    <div ref={targetRef}>
      <motion.div ref={containerRef} style={{ opacity, y }} className="relative w-full cursor-grab active:cursor-grabbing">
        <motion.div
          className="w-max"
          drag="x"
          dragConstraints={{ left: dragConstraint, right: 0 }}
          dragElastic={0.05}
          onPointerDownCapture={() => { dragged.current = false }}
          onDragStart={() => { dragged.current = true }}
        >
          <motion.div
            ref={gridRef}
            className="grid h-[520px] auto-cols-[15rem] grid-flow-col grid-rows-2 gap-4 px-4 sm:auto-cols-[17rem] md:px-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {photos.map((p, i) => (
              <motion.button
                key={p.id}
                type="button"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => { if (!dragged.current) setSelected(i) }}
                aria-label={`Lihat foto ${p.album?.title ?? ''}`}
                className={cn(
                  'group relative flex select-none items-end overflow-hidden rounded-2xl border bg-emerald-950 text-left shadow-sm',
                  SPANS[i % SPANS.length],
                )}
              >
                <Image
                  src={p.image_url}
                  alt={p.caption ?? p.album?.title ?? 'Foto galeri'}
                  fill
                  className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 640px) 34rem, 15rem"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none relative z-10 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {p.album?.title && <h3 className="text-sm font-bold text-white">{p.album.title}</h3>}
                  {p.caption && <p className="mt-0.5 text-xs text-white/80 line-clamp-2">{p.caption}</p>}
                </div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <button onClick={() => setSelected(null)} aria-label="Tutup" className="absolute right-4 top-4 text-white/80 transition-colors hover:text-white">
              <X className="h-7 w-7" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSelected((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)) }}
              aria-label="Sebelumnya"
              className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <motion.figure
              key={current.id}
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.image_url} alt={current.caption ?? 'Foto'} className="max-h-[85vh] w-full rounded-lg object-contain" />
              {(current.caption || current.album?.title) && (
                <figcaption className="mt-3 text-center text-sm text-white/80">
                  {current.album?.title}
                  {current.caption ? ` — ${current.caption}` : ''}
                </figcaption>
              )}
            </motion.figure>
            <button
              onClick={(e) => { e.stopPropagation(); setSelected((i) => (i === null ? i : (i + 1) % photos.length)) }}
              aria-label="Berikutnya"
              className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
