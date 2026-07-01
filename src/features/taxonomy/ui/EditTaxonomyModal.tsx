'use client'

import { useActionState, useEffect } from 'react'
import { updateTaxonomyAction } from '../api/actions'
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
import { Loader2 } from 'lucide-react'

type TaxonomyType = 'ARTICLE_CATEGORY' | 'DOCUMENT_CATEGORY' | 'TAG' | 'UNIVERSITY'

type EditItem = { id: string; name: string; slug: string }

export function EditTaxonomyModal({
  open,
  onOpenChange,
  item,
  type,
  label,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: EditItem | null
  type: TaxonomyType
  label: string
}) {
  const [state, formAction, isPending] = useActionState(updateTaxonomyAction, initialActionState)

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => onOpenChange(false), 0)
    }
  }, [state, onOpenChange])

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {label}</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-4">
          {!state?.success && state?.message && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {state.message}
            </div>
          )}

          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="type" value={type} />

          <div className="space-y-2">
            <Label htmlFor="edit-name">Nama {label}</Label>
            <Input
              id="edit-name"
              name="name"
              required
              disabled={isPending}
              defaultValue={item.name}
              className={state?.fieldErrors?.name ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.name && (
              <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>URL Slug</Label>
            <Input value={item.slug} readOnly disabled className="font-mono text-xs bg-muted text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Slug tidak berubah saat nama diedit demi menjaga tautan publik.</p>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
