'use client'

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/Dialog'
import { Button } from '@/shared/ui/Button'
import { Trash2, AlertTriangle } from 'lucide-react'

export type ConfirmOptions = {
  title: string
  description?: ReactNode
  confirmText?: string
  cancelText?: string
  /** 'destructive' (default) shows a red confirm button; 'default' for non-destructive confirmations. */
  variant?: 'destructive' | 'default'
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

/** Promise-based replacement for window.confirm(). Resolves true when confirmed, false when cancelled. */
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within <ConfirmProvider>')
  return ctx
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolverRef = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts)
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const close = useCallback((result: boolean) => {
    resolverRef.current?.(result)
    resolverRef.current = null
    setOptions(null)
  }, [])

  const isDestructive = options?.variant !== 'default'

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={options !== null} onOpenChange={(open) => { if (!open) close(false) }}>
        <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
          <DialogHeader>
            <div className="flex items-start gap-3">
              <span
                className={
                  isDestructive
                    ? 'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive'
                    : 'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary'
                }
              >
                {isDestructive ? <Trash2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              </span>
              <div className="space-y-1">
                <DialogTitle>{options?.title}</DialogTitle>
                {options?.description && <DialogDescription>{options.description}</DialogDescription>}
              </div>
            </div>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => close(false)}>
              {options?.cancelText ?? 'Batal'}
            </Button>
            <Button
              type="button"
              variant={isDestructive ? 'destructive' : 'default'}
              onClick={() => close(true)}
              autoFocus
            >
              {options?.confirmText ?? (isDestructive ? 'Hapus' : 'Lanjutkan')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  )
}
