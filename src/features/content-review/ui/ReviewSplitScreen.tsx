'use client'

import { useActionState, useState, useEffect, useId, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { processReviewAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Textarea } from '@/shared/ui/Textarea'
import { AlertCircle, Loader2, CheckCircle2, XCircle, AlertTriangle, Gavel } from 'lucide-react'
import Link from 'next/link'
import { ReviewEntityType, ReviewActionEnum } from '@/entities/review-history/model/schema'
import Image from 'next/image'
import { BackButton } from '@/shared/ui/BackButton'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from '@/shared/ui/Drawer'

const ENTITY_LABEL: Record<string, string> = {
  ARTICLE: 'Artikel',
  AGENDA: 'Agenda',
  COMMISSARIAT_PROFILE: 'Profil Komisariat',
  CADRE_VERIFICATION: 'Verifikasi Kader',
}

interface ReviewSplitScreenProps {
  entityType: ReviewEntityType
  entityId: string
  previewData: {
    title: string
    subtitle?: string
    contentHtml?: string
    imageUrl?: string
    fileDownloadUrl?: string
    metadata?: Array<{ label: string; value: string }>
  }
  /** Bila diisi, panel pratinjau memakai slot ini (mis. ArticleReadingView) alih-alih layout generic. */
  previewSlot?: ReactNode
}

export function ReviewSplitScreen({ entityType, entityId, previewData, previewSlot }: ReviewSplitScreenProps) {
  return (
    <div className="flex flex-col gap-6 lg:h-[calc(100vh-120px)] lg:flex-row">
      {/* Panel Pratinjau — mobile: full tanpa border (seperti baca artikel di web depan); desktop: kartu. */}
      <div className="flex-1 overflow-y-auto pb-24 lg:rounded-xl lg:border lg:bg-card lg:pb-0">
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background/95 p-6 backdrop-blur lg:bg-card/95">
          <BackButton href="/dashboard/review-center" className="shrink-0" />
          <div>
            <h2 className="text-xl font-bold">Pratinjau {ENTITY_LABEL[entityType] ?? 'Pengajuan'}</h2>
            <p className="text-sm text-muted-foreground">Tampilan ini bersifat Read-Only.</p>
          </div>
        </div>

        {previewSlot ? (
          <div className="mx-auto max-w-4xl px-5 py-6 lg:p-8">{previewSlot}</div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-8 px-5 py-6 lg:p-8">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{previewData.title}</h1>
              {previewData.subtitle && (
                <p className="text-xl text-muted-foreground">{previewData.subtitle}</p>
              )}
            </div>

            {previewData.metadata && previewData.metadata.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center py-4 border-y border-border/50">
                {previewData.metadata.map((meta, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">{meta.label}</span>
                    <span className="text-sm font-medium">{meta.value}</span>
                  </div>
                ))}
              </div>
            )}

            {previewData.imageUrl && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
                <Image src={previewData.imageUrl} alt={previewData.title} fill className="object-cover" unoptimized />
              </div>
            )}

            {previewData.fileDownloadUrl && (
              <div className="flex justify-center py-10">
                <Link href={previewData.fileDownloadUrl} target="_blank" prefetch={false}>
                  <Button size="lg" className="h-16 px-8 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
                    Unduh Berkas Excel Verifikasi Kader
                  </Button>
                </Link>
              </div>
            )}

            {previewData.contentHtml && (
              <div
                className="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-xl prose-img:mx-auto"
                dangerouslySetInnerHTML={{ __html: previewData.contentHtml }}
              />
            )}
          </div>
        )}
      </div>

      {/* Desktop: kolom keputusan menetap di kanan. */}
      <div className="hidden w-full shrink-0 overflow-y-auto rounded-xl border bg-card p-6 lg:block lg:w-[400px]">
        <DecisionPanel entityType={entityType} entityId={entityId} />
      </div>

      {/* Mobile: tombol menetap di bawah → drawer dari bawah berisi kartu keputusan. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-4 backdrop-blur lg:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="w-full" size="lg">
              <Gavel className="mr-2 h-4 w-4" />
              Beri Keputusan
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Keputusan Peninjauan</DrawerTitle>
              <DrawerDescription>Pilih aksi yang sesuai untuk pengajuan ini.</DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-6">
              <DecisionPanel entityType={entityType} entityId={entityId} heading={false} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}

/**
 * Kartu form keputusan (self-contained: useActionState + state sendiri) agar bisa dipakai di dua tempat —
 * kolom kanan desktop dan drawer mobile. Sukses → toast + redirect ke antrean review.
 */
function DecisionPanel({
  entityType,
  entityId,
  heading = true,
}: {
  entityType: ReviewEntityType
  entityId: string
  heading?: boolean
}) {
  const [state, formAction, isPending] = useActionState(processReviewAction, initialActionState)
  const [actionType, setActionType] = useState<ReviewActionEnum | null>(null)
  const [note, setNote] = useState('')
  const router = useRouter()
  const noteId = useId()
  const rowCountId = useId()

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      router.push('/dashboard/review-center')
    }
  }, [state, router])

  return (
    <div className="flex flex-col gap-6">
      {heading && (
        <div>
          <h3 className="font-heading text-lg font-semibold">Keputusan Peninjauan</h3>
          <p className="text-sm text-muted-foreground">Pilih aksi yang sesuai untuk pengajuan ini.</p>
        </div>
      )}

      {!state?.success && state?.message && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-6">
        <input type="hidden" name="entity_id" value={entityId} />
        <input type="hidden" name="entity_type" value={entityType} />
        <input type="hidden" name="action" value={actionType || ''} />

        <div className="space-y-3">
          <Label>Pilih Keputusan *</Label>
          <div className="grid grid-cols-1 gap-2">
            <Button
              type="button"
              variant={actionType === 'APPROVED' ? 'default' : 'outline'}
              className={actionType === 'APPROVED' ? 'bg-green-600 hover:bg-green-700 text-white' : 'hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-950'}
              onClick={() => setActionType('APPROVED')}
              disabled={isPending}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Setujui (Publish)
            </Button>

            <Button
              type="button"
              variant={actionType === 'REVISION' ? 'default' : 'outline'}
              className={actionType === 'REVISION' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:hover:bg-amber-950'}
              onClick={() => setActionType('REVISION')}
              disabled={isPending}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Minta Revisi
            </Button>

            <Button
              type="button"
              variant={actionType === 'REJECTED' ? 'destructive' : 'outline'}
              className={actionType === 'REJECTED' ? '' : 'hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:hover:bg-red-950'}
              onClick={() => setActionType('REJECTED')}
              disabled={isPending}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Tolak Mentah
            </Button>
          </div>
          {state?.fieldErrors?.action && (
            <p className="text-xs text-destructive">Harap pilih keputusan.</p>
          )}
        </div>

        {entityType === 'CADRE_VERIFICATION' && actionType === 'APPROVED' && (
          <div className="space-y-2 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <Label htmlFor={rowCountId} className="text-green-800 dark:text-green-400">
              Jumlah Kader Tervalidasi *
            </Label>
            <Input
              id={rowCountId}
              name="row_count"
              type="number"
              placeholder="Masukkan jumlah total kader"
              required
              disabled={isPending}
              className={state?.fieldErrors?.row_count ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.row_count && (
              <p className="text-xs text-destructive">{state.fieldErrors.row_count[0]}</p>
            )}
            <p className="text-xs text-green-700/80 dark:text-green-500/80">
              Sistem akan mengunci angka ini sebagai profil publik komisariat terkait setelah Anda menekan tombol Approve.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={noteId}>
            Catatan Peninjauan
            {(actionType === 'REVISION' || actionType === 'REJECTED') && ' *'}
          </Label>
          <Textarea
            id={noteId}
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={actionType === 'APPROVED' ? 'Opsional. Pesan selamat...' : 'Wajib diisi (Min 10 karakter). Alasan penolakan atau instruksi revisi...'}
            rows={5}
            disabled={isPending}
            className={state?.fieldErrors?.note ? 'border-destructive' : ''}
          />
          {state?.fieldErrors?.note && (
            <p className="text-xs text-destructive">{state.fieldErrors.note[0]}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Catatan ini akan dikirimkan sebagai notifikasi ke pembuat draf.
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isPending || !actionType}>
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
          ) : (
            'Kirim Keputusan'
          )}
        </Button>
      </form>
    </div>
  )
}
