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
import { Loader2, CalendarPlus, Trash2, Plus, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { POSITION_GROUPS, GROUP_LABELS, type PositionGroup } from './position-groups'

type Row = { id?: string; name: string; layout: PositionGroup }
type EditableRow = Row & { _key: string }

const genKey = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)

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

  const [rows, setRows] = useState<EditableRow[]>(() =>
    (initial?.positions.length
      ? initial.positions
      : [
          { name: '', layout: 'KSB' as PositionGroup },
          { name: '', layout: 'KSB' as PositionGroup },
          { name: '', layout: 'KSB' as PositionGroup },
        ]
    ).map((r) => ({ ...r, _key: genKey() }))
  )
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
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

  const updateRow = (key: string, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r._key === key ? { ...r, ...patch } : r)))
  }
  const addRow = () => setRows((prev) => [...prev, { name: '', layout: 'KETUA_BIDANG', _key: genKey() }])
  const removeRow = (key: string) => setRows((prev) => prev.filter((r) => r._key !== key))

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    setRows((prev) => {
      const oldIndex = prev.findIndex((r) => r._key === active.id)
      const newIndex = prev.findIndex((r) => r._key === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={rows.map((r) => r._key)} strategy={verticalListSortingStrategy}>
              {rows.map((row, index) => (
                <SortablePeriodRow
                  key={row._key}
                  row={row}
                  index={index}
                  isPending={isPending}
                  canRemove={rows.length > 1}
                  onUpdate={updateRow}
                  onRemove={removeRow}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <p className="text-xs text-muted-foreground">Seret ikon titik enam untuk mengubah urutan jabatan.</p>
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

function SortablePeriodRow({
  row,
  index,
  isPending,
  canRemove,
  onUpdate,
  onRemove,
}: {
  row: EditableRow
  index: number
  isPending: boolean
  canRemove: boolean
  onUpdate: (key: string, patch: Partial<Row>) => void
  onRemove: (key: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row._key })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 bg-card">
      <button
        type="button"
        className="shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Seret untuk mengubah urutan"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="w-5 text-right text-xs text-muted-foreground">{index + 1}.</span>
      <Input
        value={row.name}
        onChange={(e) => onUpdate(row._key, { name: e.target.value })}
        placeholder="Cth: Ketua Umum, Ketua Bidang PTKP"
        disabled={isPending}
        className="flex-1"
      />
      <Select value={row.layout} onValueChange={(v) => onUpdate(row._key, { layout: v as PositionGroup })} disabled={isPending}>
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
        onClick={() => onRemove(row._key)}
        disabled={isPending || !canRemove}
        className="shrink-0 text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
