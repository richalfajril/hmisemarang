'use client'

import { useActionState, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/Dialog'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { UserPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { initialActionState } from '@/shared/lib/action-state'
import { createCommissariatAccountAction } from '../api/actions'

export function CreateAccountModal() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(
    createCommissariatAccountAction,
    initialActionState
  )

  useEffect(() => {
    if (state?.success && state.message) {
      toast.success(state.message)
      setTimeout(() => setOpen(false), 0)
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Tambah Manual
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Akun Komisariat</DialogTitle>
          <DialogDescription>
            Buat satu akun secara manual. Password default: <strong>123456</strong>.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          {!state?.success && state?.message && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{state.message}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nama Komisariat</Label>
            <Input
              id="name"
              name="name"
              required
              disabled={isPending}
              placeholder="cth: Komisariat FH Undip"
              className={state?.fieldErrors?.name ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.name && (
              <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              required
              disabled={isPending}
              placeholder="username untuk login"
              className={state?.fieldErrors?.username ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.username && (
              <p className="text-xs text-destructive">{state.fieldErrors.username[0]}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buat Akun
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
