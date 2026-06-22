'use client'

import { useActionState } from 'react'
import { loginAction } from '../api/actions'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/shared/ui/Field'
import { AlertCircle, Loader2 } from 'lucide-react'
import { initialActionState } from '@/shared/lib/action-state'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialActionState)

  return (
    <form action={formAction} className="flex flex-col gap-6 w-full">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Selamat Datang</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Masukkan kredensial Anda untuk mengakses sistem
          </p>
        </div>

        {!state?.success && state?.message && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive animate-in fade-in zoom-in-95">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{state.message}</p>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Alamat Email</FieldLabel>
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
            <FieldError errors={state.fieldErrors.email.map(msg => ({ message: msg }))} />
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
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
            <FieldError errors={state.fieldErrors.password.map(msg => ({ message: msg }))} />
          )}
        </Field>

        <Field>
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
        </Field>
      </FieldGroup>
    </form>
  )
}
