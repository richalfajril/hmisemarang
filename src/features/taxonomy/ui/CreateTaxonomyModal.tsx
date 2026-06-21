'use client'

import { useActionState, useState, useEffect } from 'react'
import { createTaxonomyAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/Dialog'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Loader2, PlusCircle } from 'lucide-react'

export function CreateTaxonomyModal({ type, label }: { type: 'ARTICLE_CATEGORY' | 'DOCUMENT_CATEGORY' | 'TAG', label: string }) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createTaxonomyAction, initialActionState)

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => setOpen(false), 0)
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah {label}</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-4">
          {!state?.success && state?.message && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {state.message}
            </div>
          )}

          <input type="hidden" name="type" value={type} />

          <div className="space-y-2">
            <Label htmlFor="name">Nama {label}</Label>
            <Input
              id="name"
              name="name"
              required
              disabled={isPending}
              placeholder={`Contoh: ${type === 'TAG' ? 'Mahasiswa' : 'Berita Utama'}`}
              className={state?.fieldErrors?.name ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.name && (
              <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
            )}
            <p className="text-xs text-muted-foreground">URL (slug) akan dihasilkan secara otomatis.</p>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
