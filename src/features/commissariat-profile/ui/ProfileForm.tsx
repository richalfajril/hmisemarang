'use client'

import { useActionState, useState } from 'react'
import { saveProfileDraftAction, submitProfileAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Textarea } from '@/shared/ui/Textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/Tabs'
import { ImageUploader } from '@/shared/ui/image-uploader/ImageUploader'
import { Combobox, type ComboboxOption } from '@/shared/ui/Combobox'
import { Loader2, Save, Send, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useTransition } from 'react'

interface ProfileFormProps {
  initialData?: {
    name?: string | null
    address?: string | null
    established_date?: string | Date | null
    contact_email?: string | null
    contact_phone?: string | null
    instagram_url?: string | null
    twitter_url?: string | null
    facebook_url?: string | null
    website_url?: string | null
    logo_url?: string | null
    secretariat_photo_url?: string | null
    campus_name?: string | null
    university_id?: string | null
    about?: string | null
    chairman_name?: string | null
    chairman_period?: string | null
    chairman_about?: string | null
    cadre_count?: number | null
    map_url?: string | null
  } | null
  submissionId?: string
  status?: string // 'DRAFT' | 'SUBMITTED' | 'REJECTED' | 'APPROVED'
  universities?: Array<{ id: string; name: string }>
}

export function ProfileForm({ initialData, submissionId, status, universities = [] }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(saveProfileDraftAction, initialActionState)
  const [logo, setLogo] = useState<string>((initialData?.logo_url as string) || '')
  const [photo, setPhoto] = useState<string>((initialData?.secretariat_photo_url as string) || '')
  const [universityId, setUniversityId] = useState<string>(initialData?.university_id || '')
  const [isSubmitPending, startTransition] = useTransition()

  const universityOptions: ComboboxOption[] = universities.map(u => ({
    value: u.id,
    label: u.name,
  }))

  const isReadOnly = status === 'SUBMITTED'

  const handleSubmit = () => {
    if (!submissionId) return
    if (!window.confirm('Ajukan profil ini ke Cabang untuk direview? Anda tidak bisa mengedit lagi sampai direview.')) return

    startTransition(async () => {
      const result = await submitProfileAction(submissionId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Edit Profil Komisariat</h2>
          {isReadOnly && (
            <p className="text-amber-600 dark:text-amber-400 mt-1">
              Profil sedang dalam peninjauan Cabang. Anda tidak dapat melakukan perubahan.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            form="profile-form" 
            disabled={isPending || isReadOnly || isSubmitPending}
            variant="outline"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Draf
          </Button>
          {(status === 'DRAFT' || status === 'REJECTED') && submissionId && (
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isPending || isReadOnly || isSubmitPending}
            >
              {isSubmitPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Ajukan Review
            </Button>
          )}
        </div>
      </div>

      {!state?.success && state?.message && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <form id="profile-form" action={formAction}>
        <input type="hidden" name="logo_url" value={logo} />
        <input type="hidden" name="secretariat_photo_url" value={photo} />

        <Tabs defaultValue="branding" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="branding">Identitas & Branding</TabsTrigger>
            <TabsTrigger value="leadership">Kepemimpinan</TabsTrigger>
            <TabsTrigger value="contact">Kontak & Lokasi</TabsTrigger>
          </TabsList>

          <TabsContent value="branding" className="space-y-6 mt-6 border p-6 rounded-lg bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Komisariat *</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={initialData?.name || ''}
                    disabled={isPending || isReadOnly}
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
                    disabled={isPending || isReadOnly}
                  />
                  {state?.fieldErrors?.campus_name && <p className="text-xs text-destructive">{state.fieldErrors.campus_name[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about">Tentang Komisariat (Sejarah Singkat)</Label>
                  <Textarea
                    id="about"
                    name="about"
                    defaultValue={initialData?.about || ''}
                    disabled={isPending || isReadOnly}
                    rows={6}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo Komisariat (rasio 1:1)</Label>
                <ImageUploader
                  value={logo}
                  onChange={setLogo}
                  folder="public-media"
                  disabled={isPending || isReadOnly}
                  className="aspect-square max-w-[240px] w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leadership" className="space-y-6 mt-6 border p-6 rounded-lg bg-card">
            <div className="space-y-6 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="chairman_name">Nama Ketua Umum *</Label>
                <Input
                  id="chairman_name"
                  name="chairman_name"
                  defaultValue={initialData?.chairman_name || ''}
                  disabled={isPending || isReadOnly}
                  className={state?.fieldErrors?.chairman_name ? 'border-destructive' : ''}
                  required
                />
                {state?.fieldErrors?.chairman_name && <p className="text-xs text-destructive">{state.fieldErrors.chairman_name[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="chairman_period">Periode Kepengurusan</Label>
                <Input
                  id="chairman_period"
                  name="chairman_period"
                  defaultValue={initialData?.chairman_period || ''}
                  disabled={isPending || isReadOnly}
                  placeholder="Contoh: 2023-2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chairman_about">Pesan / Visi Misi Ketua Umum</Label>
                <Textarea
                  id="chairman_about"
                  name="chairman_about"
                  defaultValue={initialData?.chairman_about || ''}
                  disabled={isPending || isReadOnly}
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6 mt-6 border p-6 rounded-lg bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="instagram_url">Link Instagram</Label>
                  <Input
                    id="instagram_url"
                    name="instagram_url"
                    type="url"
                    placeholder="https://instagram.com/..."
                    defaultValue={initialData?.instagram_url || ''}
                    disabled={isPending || isReadOnly}
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
                    disabled={isPending || isReadOnly}
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
                    disabled={isPending || isReadOnly}
                    rows={3}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Foto Depan Sekretariat (rasio 16:9) (Opsional)</Label>
                <ImageUploader
                  value={photo}
                  onChange={setPhoto}
                  folder="public-media"
                  disabled={isPending || isReadOnly}
                  className="aspect-video w-full"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
