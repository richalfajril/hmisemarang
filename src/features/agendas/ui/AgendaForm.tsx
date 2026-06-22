'use client'

import { useActionState, useState } from 'react'
import { saveAgendaDraftAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Textarea } from '@/shared/ui/Textarea'
import { TiptapEditor } from '@/shared/ui/editor/TiptapEditor'
import { ImageUploader } from '@/shared/ui/image-uploader/ImageUploader'
import { Agenda } from '@prisma/client'
import { Loader2, Save, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/shared/ui/PageHeader'
import { format } from 'date-fns'

interface AgendaFormProps {
  initialData?: Agenda
}

function formatDatetimeForInput(date?: Date | null) {
  if (!date) return ''
  // Format to YYYY-MM-DDThh:mm for datetime-local input
  return format(new Date(date), "yyyy-MM-dd'T'HH:mm")
}

export function AgendaForm({ initialData }: AgendaFormProps) {
  const [state, formAction, isPending] = useActionState(saveAgendaDraftAction, initialActionState)
  const [description, setDescription] = useState(initialData?.description || '')
  const [flyer, setFlyer] = useState(initialData?.flyer_url || '')

  return (
    <form action={formAction} className="space-y-8">
      <PageHeader
        title={initialData ? 'Edit Draf Agenda' : 'Buat Agenda Baru'}
        description={initialData ? 'Perbarui informasi draf agenda Anda.' : 'Buat agenda baru untuk dipublikasikan setelah disetujui.'}
        backHref="/dashboard/agendas"
      >
        <Link href="/dashboard/agendas" prefetch>
          <Button variant="outline" type="button" disabled={isPending}>Batal</Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Simpan Draf
        </Button>
      </PageHeader>

      {!state?.success && state?.message && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-4 text-sm text-destructive animate-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="flyer_url" value={flyer} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Agenda *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title || ''}
              disabled={isPending}
              placeholder="Contoh: Latihan Kader I"
              className={state?.fieldErrors?.title ? 'border-destructive' : ''}
              required
            />
            {state?.fieldErrors?.title && (
              <p className="text-xs text-destructive">{state.fieldErrors.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (Opsional)</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={initialData?.slug || ''}
              disabled={isPending}
              placeholder="Kosongkan untuk otomatis"
              className={state?.fieldErrors?.slug ? 'border-destructive' : ''}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_datetime">Waktu Mulai *</Label>
              <Input
                id="start_datetime"
                name="start_datetime"
                type="datetime-local"
                defaultValue={formatDatetimeForInput(initialData?.start_datetime)}
                disabled={isPending}
                className={state?.fieldErrors?.start_datetime ? 'border-destructive' : ''}
                required
              />
              {state?.fieldErrors?.start_datetime && (
                <p className="text-xs text-destructive">{state.fieldErrors.start_datetime[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_datetime">Waktu Berakhir</Label>
              <Input
                id="end_datetime"
                name="end_datetime"
                type="datetime-local"
                defaultValue={formatDatetimeForInput(initialData?.end_datetime)}
                disabled={isPending}
                className={state?.fieldErrors?.end_datetime ? 'border-destructive' : ''}
              />
              {state?.fieldErrors?.end_datetime && (
                <p className="text-xs text-destructive">{state.fieldErrors.end_datetime[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Deskripsi Singkat (Excerpt)</Label>
            <Textarea
              id="short_description"
              name="short_description"
              defaultValue={initialData?.short_description || ''}
              disabled={isPending}
              placeholder="Sorotan singkat acara..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Deskripsi Lengkap *</Label>
            <div className={state?.fieldErrors?.description ? 'border border-destructive rounded-md' : ''}>
              <TiptapEditor
                value={description}
                onChange={setDescription}
                disabled={isPending}
              />
            </div>
            {state?.fieldErrors?.description && (
              <p className="text-xs text-destructive">{state.fieldErrors.description[0]}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Flyer Acara</Label>
            <ImageUploader
              value={flyer}
              onChange={setFlyer}
              folder="public-media"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground mt-2">Rekomendasi rasio 4:5 (untuk Instagram). Maks 5MB.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location_name">Nama Lokasi</Label>
            <Input
              id="location_name"
              name="location_name"
              defaultValue={initialData?.location_name || ''}
              disabled={isPending}
              placeholder="Contoh: Gedung A"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location_url">URL Lokasi (Google Maps)</Label>
            <Input
              id="location_url"
              name="location_url"
              type="url"
              defaultValue={initialData?.location_url || ''}
              disabled={isPending}
              placeholder="https://maps.google.com/..."
              className={state?.fieldErrors?.location_url ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.location_url && (
              <p className="text-xs text-destructive">{state.fieldErrors.location_url[0]}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
