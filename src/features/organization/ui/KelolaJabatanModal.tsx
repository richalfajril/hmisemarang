'use client'

import { useActionState, useState } from 'react'
import { createPositionAction, deletePositionAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Badge } from '@/shared/ui/Badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/Select'
import { PlusCircle, Trash2, Pencil, Loader2, Settings2 } from 'lucide-react'
import { EditPositionModal } from './EditPositionModal'
import { POSITION_GROUPS, GROUP_LABELS, normalizeGroup, type PositionGroup } from './position-groups'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/shared/ui/Dialog'

type PositionRow = { id: string; name: string; layout_type: string | null; memberCount: number }

export function KelolaJabatanModal({ periodId, positions }: { periodId: string; positions: PositionRow[] }) {
  const [state, formAction, isPending] = useActionState(createPositionAction, initialActionState)
  const [group, setGroup] = useState<PositionGroup>('KETUA_BIDANG')
  const [editItem, setEditItem] = useState<PositionRow | null>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings2 className="mr-2 h-4 w-4" />
          Kelola Jabatan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kelola Jabatan</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <form action={formAction} className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <input type="hidden" name="period_id" value={periodId} />
            <input type="hidden" name="sort_order" value={positions.length + 1} />
            <input type="hidden" name="layout_type" value={group} />
            <div className="flex-1 space-y-1">
              <label htmlFor="new-position-name" className="text-xs font-medium">Nama Jabatan</label>
              <Input id="new-position-name" name="name" placeholder="Cth: Ketua Bidang PTKP" required disabled={isPending} />
            </div>
            <div className="space-y-1 w-full sm:w-[160px]">
              <label className="text-xs font-medium">Grup</label>
              <Select value={group} onValueChange={(v) => setGroup(v as PositionGroup)} disabled={isPending}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {POSITION_GROUPS.map((g) => (
                    <SelectItem key={g} value={g}>{GROUP_LABELS[g]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Tambah
            </Button>
          </form>
          {state?.message && !state.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <div className="divide-y rounded-md border max-h-[300px] overflow-y-auto">
            {positions.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Belum ada jabatan.</p>
            ) : (
              positions.map((pos) => (
                <div key={pos.id} className="flex items-center justify-between gap-2 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-medium" title={pos.name}>{pos.name}</span>
                    <Badge variant="secondary" className="shrink-0">{GROUP_LABELS[normalizeGroup(pos.layout_type)]}</Badge>
                    <span className="shrink-0 text-xs text-muted-foreground">{pos.memberCount} pengurus</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditItem(pos)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <form action={async (formData) => { await deletePositionAction(null, formData) }}>
                      <input type="hidden" name="id" value={pos.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={(e) => { if (!confirm(`Hapus jabatan "${pos.name}" beserta pengurusnya?`)) e.preventDefault() }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button variant="ghost">Batal</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Simpan Perubahan</Button>
          </DialogClose>
        </DialogFooter>

        {editItem && (
          <EditPositionModal
            key={editItem.id}
            open={true}
            onOpenChange={(o) => { if (!o) setEditItem(null) }}
            item={editItem}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
