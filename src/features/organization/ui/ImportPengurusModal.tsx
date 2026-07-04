'use client'

import { useActionState, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/Dialog'
import { Button } from '@/shared/ui/Button'
import { Label } from '@/shared/ui/Label'
import { Upload, Loader2, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'
import { initialActionState } from '@/shared/lib/action-state'
import { importBoardMembersAction } from '../api/actions'

type ImportResult = {
  created: number
  skipped: { row: number; name: string; reason: string }[]
}

export function ImportPengurusModal({ periodId }: { periodId: string }) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(importBoardMembersAction, initialActionState)
  const result = state?.success ? (state.data as ImportResult | undefined) : undefined

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Impor Pengurus (Excel)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Impor Pengurus</DialogTitle>
          <DialogDescription>
            Unggah berkas Excel (.xlsx/.xls) dengan kolom:{' '}
            <strong>Foto_URL</strong>, <strong>Nama_Lengkap</strong>, <strong>Jabatan</strong>,{' '}
            <strong>Asal_Komisariat</strong>, <strong>Asal_Kampus</strong>, <strong>Bio</strong>,{' '}
            <strong>URL_Instagram</strong>, <strong>URL_TikTok</strong>, <strong>URL_X</strong>,{' '}
            <strong>URL_Linkedin</strong>. Wajib: Nama_Lengkap &amp; Jabatan. Jabatan baru otomatis dibuat;
            kampus/komisariat dicocokkan dengan data yang ada.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {result.created} pengurus berhasil dibuat.
            </div>
            {result.skipped.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/30">
                <p className="mb-2 flex items-center gap-2 font-medium text-amber-800 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {result.skipped.length} baris dilewati:
                </p>
                <ul className="max-h-40 space-y-1 overflow-y-auto text-xs text-amber-700 dark:text-amber-500">
                  {result.skipped.map((s, i) => (
                    <li key={i}>
                      Baris {s.row} ({s.name}): {s.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button className="w-full" onClick={() => setOpen(false)}>
              Selesai
            </Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4 pt-2">
            <input type="hidden" name="period_id" value={periodId} />
            {!state?.success && state?.message && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{state.message}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="pengurus-file">Berkas Excel</Label>
              <label
                htmlFor="pengurus-file"
                className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed p-6 text-center transition-colors hover:bg-muted/40"
              >
                <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Klik untuk pilih berkas (.xlsx / .xls)</span>
                <input
                  id="pengurus-file"
                  name="file"
                  type="file"
                  accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  required
                  disabled={isPending}
                  className="text-xs file:mr-2 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Impor
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
