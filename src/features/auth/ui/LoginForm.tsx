'use client'

import { useActionState } from 'react'
import { loginAction } from '../api/actions'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/shared/ui/Field'
import { useState } from 'react'
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { initialActionState } from '@/shared/lib/action-state'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialActionState)
  const [showPassword, setShowPassword] = useState(false)

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
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="username"
            autoComplete="username"
            required
            disabled={isPending}
            className={state?.fieldErrors?.username ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {state?.fieldErrors?.username && (
            <FieldError errors={state.fieldErrors.username.map(msg => ({ message: msg }))} />
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              disabled={isPending}
              autoComplete="current-password"
              aria-describedby="toggle-warning"
              className={state?.fieldErrors?.password ? 'border-destructive focus-visible:ring-destructive pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:outline-hidden rounded-sm"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <span id="toggle-warning" className="sr-only">Peringatan: Ini akan menampilkan kata sandi Anda di layar.</span>
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
