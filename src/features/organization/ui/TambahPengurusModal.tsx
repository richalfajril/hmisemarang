'use client'

import { useActionState, useEffect, useState } from 'react'
import { createBoardMemberAction, updateBoardMemberAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/Dialog'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Textarea } from '@/shared/ui/Textarea'
import { Combobox } from '@/shared/ui/Combobox'
import { ImageUploader } from '@/shared/ui/image-uploader/ImageUploader'
import { Loader2 } from 'lucide-react'
import { FORM_SOCIAL_PLATFORMS, getSocialIcon, type SocialLink } from './social-config'

type Option = { value: string; label: string }

export type PengurusInitial = {
  id: string
  full_name: string
  photo_url: string | null
  short_bio: string | null
  social_links: SocialLink[]
  position_id: string
  university_id: string | null
  commissariat_id: string | null
}

export function TambahPengurusModal({
  open,
  onOpenChange,
  positions,
  universities,
  commissariats,
  initial,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  positions: Option[]
  universities: Option[]
  commissariats: Option[]
  initial?: PengurusInitial
}) {
  const isEdit = !!initial
  const action = isEdit ? updateBoardMemberAction : createBoardMemberAction
  const [state, formAction, isPending] = useActionState(action, initialActionState)

  const [photoUrl, setPhotoUrl] = useState(initial?.photo_url || '')
  const [positionId, setPositionId] = useState(initial?.position_id || '')
  const [universityId, setUniversityId] = useState(initial?.university_id || '')
  const [commissariatId, setCommissariatId] = useState(initial?.commissariat_id || '')
  const [bio, setBio] = useState(initial?.short_bio || '')
  const [socials, setSocials] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      FORM_SOCIAL_PLATFORMS.map((p) => [
        p.value,
        initial?.social_links?.find((s) => s.platform === p.value)?.url ?? '',
      ])
    )
  )

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => onOpenChange(false), 0)
    }
  }, [state, onOpenChange])

  const socialJson = JSON.stringify(
    FORM_SOCIAL_PLATFORMS.filter((p) => socials[p.value]?.trim().length > 0).map((p) => ({
      platform: p.value,
      url: socials[p.value].trim(),
    }))
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Pengurus' : 'Tambah Pengurus'}</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          {!state?.success && state?.message && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{state.message}</div>
          )}

          {isEdit && <input type="hidden" name="id" value={initial!.id} />}
          <input type="hidden" name="photo_url" value={photoUrl} />
          <input type="hidden" name="social_links" value={socialJson} />

          <div className="space-y-2">
            <Label>Foto (rasio 1:1) *</Label>
            <div className="flex justify-center">
              <ImageUploader 
                value={photoUrl} 
                onChange={setPhotoUrl} 
                folder="public-media"
                disabled={isPending}
                maxDimension={600}
                className="aspect-square max-w-[240px] w-full"
              />
            </div>
            {state?.fieldErrors?.photo_url && <p className="text-center text-xs text-destructive">{state.fieldErrors.photo_url[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Nama *</Label>
            <Input
              id="full_name"
              name="full_name"
              required
              disabled={isPending}
              defaultValue={initial?.full_name || ''}
              placeholder="Disarankan maks 3 kata, sisanya disingkat (cth: Ahmad R. Falah)"
              className={state?.fieldErrors?.full_name ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.full_name && <p className="text-xs text-destructive">{state.fieldErrors.full_name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label>Jabatan *</Label>
            <Combobox
              name="position_id"
              options={positions}
              value={positionId}
              onValueChange={setPositionId}
              placeholder="Pilih jabatan..."
              searchPlaceholder="Cari jabatan..."
              emptyMessage="Jabatan tidak ditemukan."
              disabled={isPending}
            />
            {state?.fieldErrors?.position_id && <p className="text-xs text-destructive">{state.fieldErrors.position_id[0]}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kampus *</Label>
              <Combobox
                name="university_id"
                options={universities}
                value={universityId}
                onValueChange={setUniversityId}
                placeholder="Pilih kampus..."
                searchPlaceholder="Cari kampus..."
                emptyMessage="Kampus tidak ditemukan."
                disabled={isPending}
              />
              {state?.fieldErrors?.university_id && <p className="text-xs text-destructive">{state.fieldErrors.university_id[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label>Komisariat *</Label>
              <Combobox
                name="commissariat_id"
                options={commissariats}
                value={commissariatId}
                onValueChange={setCommissariatId}
                placeholder="Pilih komisariat..."
                searchPlaceholder="Cari komisariat..."
                emptyMessage="Komisariat tidak ditemukan."
                disabled={isPending}
              />
              {state?.fieldErrors?.commissariat_id && <p className="text-xs text-destructive">{state.fieldErrors.commissariat_id[0]}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Media Sosial (opsional)</Label>
            <div className="space-y-2">
              {FORM_SOCIAL_PLATFORMS.map((p) => {
                const Icon = getSocialIcon(p.value)
                return (
                  <div key={p.value} className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <Input
                      value={socials[p.value]}
                      onChange={(e) =>
                        setSocials((prev) => ({ ...prev, [p.value]: e.target.value }))
                      }
                      placeholder={`URL ${p.label}`}
                      disabled={isPending}
                      className="flex-1"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_bio">Bio Singkat (opsional)</Label>
            <Textarea
              id="short_bio"
              name="short_bio"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 200))}
              maxLength={200}
              rows={3}
              disabled={isPending}
              placeholder="Deskripsi singkat..."
              className="resize-none"
            />
            <p className="text-right text-xs text-muted-foreground">{bio.length}/200</p>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Simpan Perubahan' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
