'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import Link from 'next/link'
import { saveTestimonialAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Textarea } from '@/shared/ui/Textarea'
import { Card, CardContent } from '@/shared/ui/Card'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select'
import { ImageUploader } from '@/shared/ui/image-uploader/ImageUploader'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react'

interface TestimonialFormProps {
  initialData?: {
    id: string
    name: string
    title: string
    quote: string
    photo_url: string | null
    featured: boolean
    is_published: boolean
    display_order: number
  } | null
}

export function TestimonialForm({ initialData }: TestimonialFormProps) {
  const [state, formAction, isPending] = useActionState(saveTestimonialAction, initialActionState)
  const [photoUrl, setPhotoUrl] = useState(initialData?.photo_url ?? '')

  return (
    <form action={formAction} className="space-y-6">
      <PageHeader
        title={initialData ? 'Edit Testimoni' : 'Tambah Testimoni'}
        description="Kelola kutipan yang tampil pada section 'Kata Mereka' di halaman utama."
        backHref="/dashboard/testimonials"
      >
        <Link href="/dashboard/testimonials" prefetch>
          <Button type="button" variant="outline" disabled={isPending}>Batal</Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-4 w-4" /> Simpan</>}
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="pt-6">
          {!state?.success && state?.message && (
            <div className="mb-6 flex items-center gap-2 rounded-md bg-destructive/15 p-4 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" /> <p>{state.message}</p>
            </div>
          )}
          {state?.success && state?.message && (
            <div className="mb-6 flex items-center gap-2 rounded-md bg-green-500/15 p-4 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4 shrink-0" /> <p>{state.message}</p>
            </div>
          )}

          {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
          <input type="hidden" name="photo_url" value={photoUrl} />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Foto */}
            <div className="space-y-2">
              <Label>Foto Profil *</Label>
              <ImageUploader
                value={photoUrl || null}
                onChange={setPhotoUrl}
                folder="testimonials"
                maxDimension={400}
                disabled={isPending}
                className="aspect-square max-w-[240px]"
              />
              {state?.fieldErrors?.photo_url && (
                <p className="text-xs text-destructive">{state.fieldErrors.photo_url[0]}</p>
              )}
            </div>

            {/* Detail */}
            <div className="space-y-4 md:col-span-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={initialData?.name || ''}
                  placeholder="Prof. Drs. H. Lafran Pane"
                  disabled={isPending}
                  className={state?.fieldErrors?.name ? 'border-destructive' : ''}
                />
                {state?.fieldErrors?.name && <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={initialData?.title || ''}
                  placeholder="Pemrakarsa Berdirinya HMI / Pahlawan Nasional"
                  disabled={isPending}
                  className={state?.fieldErrors?.title ? 'border-destructive' : ''}
                />
                {state?.fieldErrors?.title && <p className="text-xs text-destructive">{state.fieldErrors.title[0]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quote">Kutipan *</Label>
                <Textarea
                  id="quote"
                  name="quote"
                  rows={4}
                  defaultValue={initialData?.quote || ''}
                  placeholder="Tulis kutipan inspiratif..."
                  disabled={isPending}
                  className={state?.fieldErrors?.quote ? 'border-destructive' : ''}
                />
                {state?.fieldErrors?.quote && <p className="text-xs text-destructive">{state.fieldErrors.quote[0]}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    name="display_order"
                    type="number"
                    min={0}
                    step={1}
                    defaultValue={initialData?.display_order ?? 0}
                    disabled={isPending}
                    className={state?.fieldErrors?.display_order ? 'border-destructive' : ''}
                  />
                  {state?.fieldErrors?.display_order && (
                    <p className="text-xs text-destructive">{state.fieldErrors.display_order[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="is_published">Status Publikasi</Label>
                  <Select
                    name="is_published"
                    defaultValue={initialData?.is_published ? 'true' : 'false'}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Published (Publik)</SelectItem>
                      <SelectItem value="false">Draft (Disembunyikan)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="featured"
                  name="featured"
                  defaultChecked={initialData?.featured ?? false}
                  disabled={isPending}
                />
                <Label htmlFor="featured" className="font-normal">
                  Tandai sebagai <span className="font-semibold">Featured</span> (tampil di homepage)
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
