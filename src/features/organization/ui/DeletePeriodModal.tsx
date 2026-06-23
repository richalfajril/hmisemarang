'use client'

import { useActionState, useEffect } from 'react'
import { deletePeriodAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/Dialog'
import { Button } from '@/shared/ui/Button'
import { Loader2, Trash2 } from 'lucide-react'

type PeriodItem = { id: string; start_year: number; end_year: number; positionCount: number }

export function DeletePeriodModal({
  open,
  onOpenChange,
  item,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: PeriodItem
}) {
  const [state, formAction, isPending] = useActionState(deletePeriodAction, initialActionState)

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => onOpenChange(false), 0)
    }
  }, [state, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hapus Periode {item.start_year}–{item.end_year}?</DialogTitle>
          <DialogDescription>
            Tindakan ini permanen dan akan menghapus periode beserta <strong>{item.positionCount} jabatan</strong> dan seluruh anggota di dalamnya. Tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        {!state?.success && state?.message && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {state.message}
          </div>
        )}

        <form action={formAction} className="pt-2 flex justify-end space-x-2">
          <input type="hidden" name="id" value={item.id} />
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" variant="destructive" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Hapus Permanen
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
