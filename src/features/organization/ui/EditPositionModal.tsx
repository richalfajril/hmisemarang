'use client'

import { useActionState, useEffect, useState } from 'react'
import { updatePositionAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/Dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Loader2 } from 'lucide-react'
import { POSITION_GROUPS, GROUP_LABELS, normalizeGroup, type PositionGroup } from './position-groups'

type PositionItem = { id: string; name: string; layout_type: string | null }

export function EditPositionModal({
  open,
  onOpenChange,
  item,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: PositionItem
}) {
  const [state, formAction, isPending] = useActionState(updatePositionAction, initialActionState)
  const [group, setGroup] = useState<PositionGroup>(normalizeGroup(item.layout_type))

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => onOpenChange(false), 0)
    }
  }, [state, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Jabatan</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4 pt-4">
          {!state?.success && state?.message && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{state.message}</div>
          )}
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="layout_type" value={group} />
          <div className="space-y-2">
            <Label htmlFor="edit-position-name">Nama Jabatan</Label>
            <Input id="edit-position-name" name="name" required disabled={isPending} defaultValue={item.name} />
          </div>
          <div className="space-y-2">
            <Label>Grup Layout</Label>
            <Select value={group} onValueChange={(v) => setGroup(v as PositionGroup)} disabled={isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POSITION_GROUPS.map((g) => (
                  <SelectItem key={g} value={g}>{GROUP_LABELS[g]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="pt-2 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>Batal</Button>
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
