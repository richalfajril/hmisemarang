'use client'

import { useActionState } from 'react'
import { loginAction } from '../api/actions'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { AlertCircle, Loader2 } from 'lucide-react'
import { initialActionState } from '@/shared/lib/action-state'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialActionState)

  return (
    <form action={formAction} className="space-y-6">
      {!state?.success && state?.message && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive animate-in fade-in zoom-in-95">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Alamat Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@hmisemarang.com"
            autoComplete="email"
            required
            disabled={isPending}
            className={state?.fieldErrors?.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {state?.fieldErrors?.email && (
            <p className="text-xs text-destructive animate-in slide-in-from-top-1">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Kata Sandi</Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={isPending}
            autoComplete="current-password"
            className={state?.fieldErrors?.password ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {state?.fieldErrors?.password && (
            <p className="text-xs text-destructive animate-in slide-in-from-top-1">{state.fieldErrors.password[0]}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memverifikasi...
          </>
        ) : (
          'Masuk ke Dasbor'
        )}
      </Button>
    </form>
  )
}
