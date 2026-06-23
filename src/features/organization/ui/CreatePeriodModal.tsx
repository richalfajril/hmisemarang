'use client'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPositionStructureAction, updatePeriodStructureAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2, CalendarPlus, Trash2, Plus } from 'lucide-react'
import { POSITION_GROUPS, GROUP_LABELS, type PositionGroup } from './position-groups'

type Row = { id?: string; name: string; layout: PositionGroup }

export type EditPeriodInitial = {
  id: string
  start_year: number
  end_year: number
  positions: Row[]
}

export function CreatePeriodModal({
  initial,
  open: controlledOpen,
  onOpenChange,
}: {
  initial?: EditPeriodInitial
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isEdit = !!initial
  const action = isEdit ? updatePeriodStructureAction : createPositionStructureAction
  const [state, formAction, isPending] = useActionState(action, initialActionState)
  const [internalOpen, setInternalOpen] = useState(false)
  const open = isEdit ? !!controlledOpen : internalOpen
  const setOpen = (o: boolean) => { if (isEdit) onOpenChange?.(o); else setInternalOpen(o) }

  const [rows, setRows] = useState<Row[]>(
    initial?.positions.length
      ? initial.positions
      : [
          { name: '', layout: 'KSB' },
          { name: '', layout: 'KSB' },
          { name: '', layout: 'KSB' },
        ]
  )
  const router = useRouter()

  const currentYear = new Date().getFullYear()

  useEffect(() => {
    if (state?.success) {
      const periodId = (state.data as { periodId?: string } | undefined)?.periodId
      if (periodId) {
        router.push(`/dashboard/organization/periods/${periodId}`)
      } else {
        setTimeout(() => setOpen(false), 0)
        router.refresh()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, router])

  const updateRow = (index: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }
  const addRow = () => setRows((prev) => [...prev, { name: '', layout: 'KETUA_BIDANG' }])
  const removeRow = (index: number) => setRows((prev) => prev.filter((_, i) => i !== index))

  const positionsJson = JSON.stringify(
    rows
      .filter((r) => r.name.trim().length > 0)
      .map((r) => ({ ...(r.id ? { id: r.id } : {}), name: r.name.trim(), layout: r.layout }))
  )

  const formBody = (
    <form action={formAction} className="space-y-4 pt-4">
      {!state?.success && state?.message && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {state.message}
        </div>
      )}

      {isEdit && <input type="hidden" name="period_id" value={initial!.id} />}
      <input type="hidden" name="positions_json" value={positionsJson} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_year">Tahun Mulai</Label>
          <Input
            id="start_year"
            name="start_year"
            type="number"
            min={1947}
            defaultValue={initial?.start_year ?? currentYear}
            required
            disabled={isPending}
            className={state?.fieldErrors?.start_year ? 'border-destructive' : ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_year">Tahun Selesai</Label>
          <Input
            id="end_year"
            name="end_year"
            type="number"
            min={1947}
            defaultValue={initial?.end_year ?? currentYear + 1}
            required
            disabled={isPending}
            className={state?.fieldErrors?.end_year ? 'border-destructive' : ''}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Daftar Jabatan</Label>
        <div className="space-y-2 h-[min(360px,42vh)] overflow-y-auto pr-1">
          {rows.map((row, index) => (
            <div key={row.id ?? `new-${index}`} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-5 text-right">{index + 1}.</span>
              <Input
                value={row.name}
                onChange={(e) => updateRow(index, { name: e.target.value })}
                placeholder="Cth: Ketua Umum, Ketua Bidang PTKP"
                disabled={isPending}
                className="flex-1"
              />
              <Select value={row.layout} onValueChange={(v) => updateRow(index, { layout: v as PositionGroup })} disabled={isPending}>
                <SelectTrigger className="w-[150px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POSITION_GROUPS.map((g) => (
                    <SelectItem key={g} value={g}>{GROUP_LABELS[g]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRow(index)}
                disabled={isPending || rows.length === 1}
                className="text-destructive hover:bg-destructive/10 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addRow} disabled={isPending} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Baris Jabatan
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">Grup menentukan tata letak kartu di halaman susunan & publik. Menghapus baris jabatan akan menghapus pengurus di dalamnya.</p>

      <div className="pt-2 flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
          Batal
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Simpan Perubahan' : 'Simpan & Susun Pengurus'}
        </Button>
      </div>
    </form>
  )

  if (isEdit) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Edit Periode Kepengurusan</DialogTitle>
          </DialogHeader>
          {formBody}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Tambah Periode
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Tambah Periode Kepengurusan</DialogTitle>
        </DialogHeader>
        {formBody}
      </DialogContent>
    </Dialog>
  )
}
