'use client'

import { useActionState, useEffect, useState } from 'react'
import { changePasswordAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Loader2, KeyRound, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialActionState)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (state?.success && state.message) toast.success(state.message)
  }, [state])

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Ganti Kata Sandi</h3>
      </div>

      <form action={formAction} className="max-w-md space-y-4">
        {!state?.success && state?.message && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{state.message}</div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Kata Sandi Baru</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={show ? 'text' : 'password'}
              required
              disabled={isPending}
              autoComplete="new-password"
              className={state?.fieldErrors?.password ? 'border-destructive pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={show ? 'Sembunyikan' : 'Tampilkan'}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {state?.fieldErrors?.password && (
            <p className="text-xs text-destructive">{state.fieldErrors.password[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Konfirmasi Kata Sandi</Label>
          <Input
            id="confirm"
            name="confirm"
            type={show ? 'text' : 'password'}
            required
            disabled={isPending}
            autoComplete="new-password"
            className={state?.fieldErrors?.confirm ? 'border-destructive' : ''}
          />
          {state?.fieldErrors?.confirm && (
            <p className="text-xs text-destructive">{state.fieldErrors.confirm[0]}</p>
          )}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Simpan Kata Sandi
        </Button>
      </form>
    </div>
  )
}
