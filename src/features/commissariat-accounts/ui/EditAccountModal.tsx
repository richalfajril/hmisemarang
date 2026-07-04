'use client'

import { useActionState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/Dialog'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { initialActionState } from '@/shared/lib/action-state'
import { updateCommissariatAccountAction } from '../api/actions'

type Account = { id: string; name: string | null; username: string | null }

export function EditAccountModal({ account, onClose }: { account: Account; onClose: () => void }) {
  const [state, formAction, isPending] = useActionState(updateCommissariatAccountAction, initialActionState)

  useEffect(() => {
    if (state?.success && state.message) {
      toast.success(state.message)
      setTimeout(onClose, 0)
    }
  }, [state, onClose])

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Akun Komisariat</DialogTitle>
          <DialogDescription>
            Ubah nama & username. Mengubah username juga mengubah email login sintetis; password tidak berubah.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          <input type="hidden" name="id" value={account.id} />
          {!state?.success && state?.message && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{state.message}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-name">Nama Komisariat</Label>
            <Input
              id="edit-name"
              name="name"
              required
              disabled={isPending}
              defaultValue={account.name ?? ''}
              className={state?.fieldErrors?.name ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.name && <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-username">Username</Label>
            <Input
              id="edit-username"
              name="username"
              required
              disabled={isPending}
              defaultValue={account.username ?? ''}
              className={state?.fieldErrors?.username ? 'border-destructive' : ''}
            />
            {state?.fieldErrors?.username && <p className="text-xs text-destructive">{state.fieldErrors.username[0]}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
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
