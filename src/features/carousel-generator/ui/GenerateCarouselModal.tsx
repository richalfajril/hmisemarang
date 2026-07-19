'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/Dialog'
import { Button } from '@/shared/ui/Button'
import { ImageUploader } from '@/shared/ui/image-uploader/ImageUploader'
import { Loader2, ChevronLeft, ChevronRight, Download, Images } from 'lucide-react'
import { generateCarousel, buildZip, downloadBlob, type GeneratedSlide } from '../lib/render'
import { saveCarouselHeaderAction } from '../api/actions'

export interface CarouselArticle {
  title: string
  slug: string
  content: string
  categoryName?: string | null
  authorName?: string | null
  authorImageUrl?: string | null
  publishedAt?: Date | string | null
  viewCount?: number | null
  featuredImageUrl?: string | null
  featuredImageCaption?: string | null
}

interface GenerateCarouselModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  article: CarouselArticle
  initialHeaderUrl?: string | null
}

type Phase = 'config' | 'loading' | 'preview'

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

export function GenerateCarouselModal({ open, onOpenChange, article, initialHeaderUrl }: GenerateCarouselModalProps) {
  const [phase, setPhase] = useState<Phase>('config')
  const [headerUrl, setHeaderUrl] = useState<string | null>(initialHeaderUrl ?? null)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [slides, setSlides] = useState<GeneratedSlide[]>([])
  const [current, setCurrent] = useState(0)
  const [zipping, setZipping] = useState(false)

  const revokeSlides = useCallback(() => {
    setSlides((prev) => {
      prev.forEach((s) => URL.revokeObjectURL(s.url))
      return []
    })
  }, [])

  // Revoke object URLs on unmount.
  useEffect(() => () => revokeSlides(), [revokeSlides])

  const handleOpenChange = (next: boolean) => {
    if (phase === 'loading') return // block closing mid-generate
    if (!next) {
      revokeSlides()
      setPhase('config')
      setCurrent(0)
    }
    onOpenChange(next)
  }

  const handleHeaderChange = async (url: string) => {
    setHeaderUrl(url || null)
    if (!url) return
    const r = await saveCarouselHeaderAction(url)
    if (!r.success) toast.error(r.message || 'Gagal menyimpan header.')
    else toast.success('Header carousel tersimpan.')
  }

  const handleGenerate = async () => {
    if (!headerUrl) return
    setPhase('loading')
    setProgress({ done: 0, total: 0 })
    try {
      const dateStr = article.publishedAt ? dateFmt.format(new Date(article.publishedAt)) : null
      const result = await generateCarousel(
        {
          title: article.title,
          slug: article.slug,
          content: article.content,
          categoryName: article.categoryName,
          authorName: article.authorName,
          authorImageUrl: article.authorImageUrl,
          dateStr,
          viewCount: article.viewCount,
          featuredImageUrl: article.featuredImageUrl,
          featuredImageCaption: article.featuredImageCaption,
          headerUrl,
        },
        (done, total) => setProgress({ done, total }),
      )
      setSlides(result)
      setCurrent(0)
      setPhase('preview')
    } catch (err) {
      console.error('Generate carousel error:', err)
      setPhase('config')
      toast.error('Gagal membuat carousel. Silakan coba kembali.')
    }
  }

  const handleDownload = async () => {
    setZipping(true)
    try {
      const zip = await buildZip(slides)
      downloadBlob(zip, `${article.slug}.zip`)
    } catch (err) {
      console.error('Zip carousel error:', err)
      toast.error('Gagal membuat ZIP.')
    } finally {
      setZipping(false)
    }
  }

  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-lg"
        showCloseButton={phase !== 'loading'}
        onEscapeKeyDown={(e) => phase === 'loading' && e.preventDefault()}
        onInteractOutside={(e) => phase === 'loading' && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Images className="h-5 w-5 text-emerald-600" /> Generate Carousel
          </DialogTitle>
          <DialogDescription>
            {phase === 'preview'
              ? 'Periksa hasil sebelum mengunduh.'
              : 'Ubah artikel ini menjadi carousel Instagram (1080×1350).'}
          </DialogDescription>
        </DialogHeader>

        {/* CONFIG */}
        {phase === 'config' && (
          <div className="space-y-5">
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <p className="font-semibold line-clamp-2">{article.title}</p>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                {article.categoryName && <span>{article.categoryName}</span>}
                <span>/{article.slug}</span>
                <span className="font-medium text-emerald-600">PUBLISHED</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Header Instagram (1080×240)</p>
              <ImageUploader
                value={headerUrl}
                onChange={handleHeaderChange}
                folder="carousel-headers"
                maxDimension={1080}
                tight
              />
              <p className="text-xs text-muted-foreground">
                Header ini dipakai di slide sampul & disimpan untuk semua admin.
              </p>
            </div>

            <ul className="rounded-lg border p-3 text-xs text-muted-foreground space-y-1">
              <li>Resolusi: 1080 × 1350 px · Format: PNG · Unduhan: ZIP</li>
              <li>Sampul (avatar/tanggal/share) + isi dimaksimalkan per slide (gambar tak terpotong) + slide CTA berisi QR Code.</li>
            </ul>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Batal
              </Button>
              <Button onClick={handleGenerate} disabled={!headerUrl}>
                Generate Carousel
              </Button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {phase === 'loading' && (
          <div className="space-y-4 py-6">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-600 transition-[width] duration-200"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {progress.total > 0 ? `Slide ${progress.done} of ${progress.total}` : 'Menyiapkan…'}
            </p>
          </div>
        )}

        {/* PREVIEW */}
        {phase === 'preview' && slides.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center rounded-lg bg-muted/40 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slides[current].url}
                alt={`Slide ${current + 1}`}
                className="h-auto w-[280px] rounded-md shadow-sm ring-1 ring-border"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {current + 1} / {slides.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrent((c) => Math.min(slides.length - 1, c + 1))}
                disabled={current === slides.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button className="w-full" onClick={handleDownload} disabled={zipping}>
              {zipping ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyiapkan ZIP…</>
              ) : (
                <><Download className="mr-2 h-4 w-4" /> Download ZIP</>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
