'use client'

import { useActionState, useEffect, useState } from 'react'
import { saveProfileDraftAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Textarea } from '@/shared/ui/Textarea'
import { ImageUploader } from '@/shared/ui/image-uploader/ImageUploader'
import { Combobox, type ComboboxOption } from '@/shared/ui/Combobox'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileFormProps {
  initialData?: {
    name?: string | null
    address?: string | null
    instagram_url?: string | null
    logo_url?: string | null
    secretariat_photo_url?: string | null
    campus_name?: string | null
    university_id?: string | null
    about?: string | null
    map_url?: string | null
  } | null
  universities?: Array<{ id: string; name: string }>
}

export function ProfileForm({ initialData, universities = [] }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(saveProfileDraftAction, initialActionState)
  const [logo, setLogo] = useState<string>((initialData?.logo_url as string) || '')
  const [photo, setPhoto] = useState<string>((initialData?.secretariat_photo_url as string) || '')
  const [universityId, setUniversityId] = useState<string>(initialData?.university_id || '')

  const universityOptions: ComboboxOption[] = universities.map(u => ({
    value: u.id,
    label: u.name,
  }))

  useEffect(() => {
    if (state?.success && state.message) toast.success(state.message)
  }, [state])

  return (
    <div className="space-y-6">
      {!state?.success && state?.message && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <form id="profile-form" action={formAction}>
        <input type="hidden" name="logo_url" value={logo} />
        <input type="hidden" name="secretariat_photo_url" value={photo} />

        <div className="space-y-8">
          <section className="space-y-6 border p-6 rounded-lg bg-card">
            <h3 className="text-lg font-semibold">Identitas &amp; Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label>Logo Komisariat (rasio 1:1)</Label>
                <ImageUploader
                  value={logo}
                  onChange={setLogo}
                  folder="public-media"
                  disabled={isPending}
                  maxDimension={512}
                  className="aspect-square max-w-[240px] w-full"
                />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Komisariat *</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={initialData?.name || ''}
                    disabled={isPending}
                    className={state?.fieldErrors?.name ? 'border-destructive' : ''}
                    required
                  />
                  {state?.fieldErrors?.name && <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university_id">Nama Kampus / Universitas *</Label>
                  <Combobox
                    options={universityOptions}
                    value={universityId}
                    onValueChange={setUniversityId}
                    name="university_id"
                    placeholder="Pilih universitas..."
                    searchPlaceholder="Ketik untuk mencari..."
                    emptyMessage="Universitas tidak ditemukan."
                    disabled={isPending}
                  />
                  {state?.fieldErrors?.university_id && <p className="text-xs text-destructive">{state.fieldErrors.university_id[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about">Tentang Komisariat (Sejarah Singkat)</Label>
                  <Textarea
                    id="about"
                    name="about"
                    defaultValue={initialData?.about || ''}
                    disabled={isPending}
                    rows={6}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6 border p-6 rounded-lg bg-card">
            <h3 className="text-lg font-semibold">Kontak &amp; Lokasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label>Foto Depan Sekretariat (rasio 16:9) (Opsional)</Label>
                <ImageUploader
                  value={photo}
                  onChange={setPhoto}
                  folder="public-media"
                  disabled={isPending}
                  maxDimension={1280}
                  className="aspect-video w-full"
                />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="instagram_url">Link Instagram</Label>
                  <Input
                    id="instagram_url"
                    name="instagram_url"
                    type="url"
                    placeholder="https://instagram.com/..."
                    defaultValue={initialData?.instagram_url || ''}
                    disabled={isPending}
                    className={state?.fieldErrors?.instagram_url ? 'border-destructive' : ''}
                  />
                  {state?.fieldErrors?.instagram_url && <p className="text-xs text-destructive">{state.fieldErrors.instagram_url[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="map_url">Link Google Maps Sekretariat</Label>
                  <Input
                    id="map_url"
                    name="map_url"
                    type="url"
                    placeholder="https://maps.google.com/..."
                    defaultValue={initialData?.map_url || ''}
                    disabled={isPending}
                    className={state?.fieldErrors?.map_url ? 'border-destructive' : ''}
                  />
                  {state?.fieldErrors?.map_url && <p className="text-xs text-destructive">{state.fieldErrors.map_url[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap Sekretariat</Label>
                  <Textarea
                    id="address"
                    name="address"
                    defaultValue={initialData?.address || ''}
                    disabled={isPending}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  )
}
