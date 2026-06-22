'use client'

import { useActionState, useRef } from 'react'
import { uploadCadreFileAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/Button'
import { Label } from '@/shared/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import { UploadCloud, FileSpreadsheet, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'

interface VerificationFormProps {
  hasPending: boolean
}

export function VerificationForm({ hasPending }: VerificationFormProps) {
  const [state, formAction, isPending] = useActionState(uploadCadreFileAction, initialActionState)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (hasPending) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
        <CardContent className="flex items-center gap-4 p-6">
          <AlertCircle className="h-8 w-8 text-amber-500" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-400">Berkas Sedang Ditinjau</h3>
            <p className="text-sm text-amber-700/80 dark:text-amber-500/80">
              Anda memiliki pengajuan verifikasi kader yang sedang dalam antrean pemeriksaan Cabang. Anda tidak dapat mengunggah berkas baru sampai berkas sebelumnya selesai diulas.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (state?.success) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/30">
        <CardContent className="flex items-center gap-4 p-6">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-400">Berhasil Diunggah!</h3>
            <p className="text-sm text-green-700/80 dark:text-green-500/80">
              {state.message}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unggah Berkas Kader Baru</CardTitle>
        <CardDescription>
          Silakan unggah pangkalan data anggota Komisariat Anda dalam format Excel (.xls, .xlsx). Maksimal ukuran file 10MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!state?.success && state?.message && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-4 mb-6 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{state.message}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">Berkas Excel Verifikasi</Label>
            <div className="relative">
              <input
                id="file"
                name="file"
                type="file"
                accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  // Force a re-render to update the display name if needed
                  const el = e.target
                  if (el.files && el.files.length > 0) {
                    const label = document.getElementById('file-name-label')
                    if (label) label.innerText = el.files[0].name
                  }
                }}
                disabled={isPending}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-muted/50 ${state?.fieldErrors?.file ? 'border-destructive' : 'border-muted-foreground/25'}`}
              >
                <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm font-medium text-center" id="file-name-label">
                  Klik untuk memilih file Excel
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Format .xls, .xlsx (Max 10MB)
                </p>
              </div>
            </div>
            {state?.fieldErrors?.file && (
              <p className="text-xs text-destructive">{state.fieldErrors.file[0]}</p>
            )}
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengunggah...</>
            ) : (
              <><UploadCloud className="mr-2 h-4 w-4" /> Kirim Berkas</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
