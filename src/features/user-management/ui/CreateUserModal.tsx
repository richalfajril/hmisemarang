'use client'

import { useActionState, useState, useEffect } from 'react'
import { createUserAction } from '../api/create-user'
import { initialActionState } from '@/shared/lib/action-state'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/ui/Dialog'
import { Button } from '@/shared/ui/ui/Button'
import { Input } from '@/shared/ui/ui/Input'
import { Label } from '@/shared/ui/ui/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/ui/Select'
import { PlusCircle, Loader2, Copy, Check } from 'lucide-react'

export function CreateUserModal({
  commissariats,
}: {
  commissariats: { id: string; name: string }[]
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [state, formAction, isPending] = useActionState(createUserAction, initialActionState)

  const [role, setRole] = useState('ADMIN_KOMISARIAT')

  // Set ulang salinan ketika dialog terbuka
  useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Undang Pengurus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Beri Akses Administrator</DialogTitle>
          <DialogDescription>
            Tambahkan pengurus Cabang atau Komisariat ke dalam sistem. Kata sandi rahasia akan dibuat secara otomatis di langkah selanjutnya.
          </DialogDescription>
        </DialogHeader>

        {state?.success && state.data ? (
          <div className="space-y-4 py-4 animate-in fade-in zoom-in-95">
            <div className="rounded-lg bg-green-50 p-4 border border-green-200 dark:bg-green-950/30 dark:border-green-900">
              <h4 className="text-sm font-semibold text-green-800 dark:text-green-500 mb-2">
                Hak Akses Berhasil Diberikan!
              </h4>
              <p className="text-xs text-green-700 dark:text-green-400 mb-4">
                Silakan salin kata sandi masuk sementara ini dan berikan secara aman kepada fungsionaris yang bersangkutan. 
                <strong> Sandi ini tidak akan ditampilkan lagi.</strong>
              </p>
              <div className="flex items-center gap-2">
                <code className="relative rounded bg-white px-3 py-2 text-sm font-mono flex-1 border border-green-200 dark:bg-black dark:border-green-800">
                  {state.data.tempPassword}
                </code>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline"
                  className="shrink-0"
                  onClick={() => copyToClipboard(state.data!.tempPassword)}
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button className="w-full" onClick={() => setOpen(false)}>Selesai</Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4 pt-4">
            {!state?.success && state?.message && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {state.message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Dinas Pengurus</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={isPending}
                placeholder="nama@hmisemarang.com"
                className={state?.fieldErrors?.email ? 'border-destructive' : ''}
              />
              {state?.fieldErrors?.email && (
                <p className="text-xs text-destructive">{state.fieldErrors.email[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Tingkat Kewenangan (Role)</Label>
              <input type="hidden" name="role" value={role} />
              <Select value={role} onValueChange={setRole} disabled={isPending}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kewenangan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN_CABANG">Admin Cabang (Pengurus Harian)</SelectItem>
                  <SelectItem value="ADMIN_KOMISARIAT">Admin Komisariat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === 'ADMIN_KOMISARIAT' && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <Label htmlFor="commissariat_id">Instansi Komisariat</Label>
                <Select name="commissariat_id" disabled={isPending} required>
                  <SelectTrigger className={state?.fieldErrors?.commissariat_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Pilih asal komisariat" />
                  </SelectTrigger>
                  <SelectContent>
                    {commissariats.map((comm) => (
                      <SelectItem key={comm.id} value={comm.id}>
                        {comm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {state?.fieldErrors?.commissariat_id && (
                  <p className="text-xs text-destructive">{state.fieldErrors.commissariat_id[0]}</p>
                )}
              </div>
            )}

            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Terbitkan Akun
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
