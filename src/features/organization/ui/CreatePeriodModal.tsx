'use client'

import { useActionState, useState, useEffect } from 'react'
import { createPeriodAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Loader2, CalendarPlus } from 'lucide-react'

export function CreatePeriodModal() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createPeriodAction, initialActionState)

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => setOpen(false), 0)
    }
  }, [state])

  const currentYear = new Date().getFullYear()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Tambah Periode Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buat Periode Kepengurusan</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-4">
          {!state?.success && state?.message && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {state.message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_year">Tahun Mulai</Label>
              <Input
                id="start_year"
                name="start_year"
                type="number"
                min={1947}
                defaultValue={currentYear}
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
                defaultValue={currentYear + 1}
                required
                disabled={isPending}
                className={state?.fieldErrors?.end_year ? 'border-destructive' : ''}
              />
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">Periode baru yang dibuat secara otomatis akan nonaktif. Anda harus mengaktifkannya di halaman daftar periode agar tampil di publik.</p>

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
