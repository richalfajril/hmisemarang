'use client'

import { useActionState, useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/Table'
import { Button } from '@/shared/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/DropdownMenu'
import { MoreHorizontal, KeyRound, Trash2, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import { SmartPagination } from '@/shared/ui/SmartPagination'
import { initialActionState } from '@/shared/lib/action-state'
import { resetCommissariatPasswordAction, deleteCommissariatAccountAction } from '../api/actions'
import { EditAccountModal } from './EditAccountModal'

export type AccountData = {
  id: string
  name: string | null
  username: string | null
  commissariat_name: string | null
  last_login_at: Date | string | null
}

export function CommissariatAccountTable({ accounts }: { accounts: AccountData[] }) {
  const [resetState, resetAction] = useActionState(resetCommissariatPasswordAction, initialActionState)
  const [deleteState, deleteAction] = useActionState(deleteCommissariatAccountAction, initialActionState)
  const [editing, setEditing] = useState<AccountData | null>(null)
  const pagination = useClientPagination(accounts, 10)

  useEffect(() => {
    if (resetState?.message) {
      if (resetState.success) toast.success(resetState.message)
      else toast.error(resetState.message)
    }
  }, [resetState])

  useEffect(() => {
    if (deleteState?.message) {
      if (deleteState.success) toast.success(deleteState.message)
      else toast.error(deleteState.message)
    }
  }, [deleteState])

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>Nama Komisariat</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Komisariat Tertaut</TableHead>
              <TableHead>Login Terakhir</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Belum ada akun. Impor melalui berkas Excel.
                </TableCell>
              </TableRow>
            ) : (
              pagination.paginatedData.map((a, i) => (
                <TableRow key={a.id}>
                  <TableCell>{(pagination.currentPage - 1) * 10 + i + 1}</TableCell>
                  <TableCell className="font-medium">{a.name || '-'}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {a.username || '-'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.commissariat_name || <span className="italic">Tidak tertaut</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.last_login_at
                      ? new Date(a.last_login_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })
                      : 'Belum Pernah'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onSelect={() => setEditing(a)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Nama & Username
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <form action={resetAction}>
                          <input type="hidden" name="id" value={a.id} />
                          <DropdownMenuItem asChild>
                            <button type="submit" className="flex w-full cursor-pointer items-center text-amber-600 focus:bg-amber-100/50 focus:text-amber-700">
                              <KeyRound className="mr-2 h-4 w-4" />
                              Reset Password (123456)
                            </button>
                          </DropdownMenuItem>
                        </form>
                        <DropdownMenuSeparator />
                        <form
                          action={deleteAction}
                          onSubmit={(e) => {
                            if (!confirm(`Hapus akun "${a.name || a.username}"?`)) e.preventDefault()
                          }}
                        >
                          <input type="hidden" name="id" value={a.id} />
                          <DropdownMenuItem asChild>
                            <button type="submit" className="flex w-full cursor-pointer items-center text-destructive focus:bg-destructive/10 focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus Akun
                            </button>
                          </DropdownMenuItem>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <SmartPagination {...pagination} />

      {editing && (
        <EditAccountModal key={editing.id} account={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}
