'use client'

import { useState, useActionState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/Table'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { forceResetPasswordAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Loader2, KeyRound, AlertCircle, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui/DropdownMenu'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import { SmartPagination } from '@/shared/ui/SmartPagination'

export type UserData = {
  id: string
  email: string
  role: string
  commissariat_name: string | null
  last_login_at: Date | null
}

export function UserTable({ users, currentUserId }: { users: UserData[], currentUserId: string }) {
  const [state, formAction, isPending] = useActionState(forceResetPasswordAction, initialActionState)
  const [resetId, setResetId] = useState<string | null>(null)
  
  const pagination = useClientPagination(users, 15)
  
  return (
    <div className="space-y-4">
      {!!(state?.success && state.data) && (
         <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 mb-6 flex items-start gap-4 animate-in fade-in zoom-in-95">
           <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
           <div>
             <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-500">Penyetelan Ulang Darurat Berhasil</h4>
             <p className="text-sm text-amber-700 dark:text-amber-600 mt-1 mb-2">
               Silakan sampaikan kata sandi baru berikut kepada pengguna secara rahasia. Akses ke sandi lama telah diputus.
             </p>
             <code className="rounded bg-amber-100 px-3 py-1.5 text-sm font-mono dark:bg-amber-900/50">
               {(state.data as { tempPassword?: string })?.tempPassword}
             </code>
           </div>
         </div>
      )}

      {!state?.success && state?.message && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive mb-6 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>Email Fungsionaris</TableHead>
              <TableHead>Status Kewenangan</TableHead>
              <TableHead>Unit / Instansi</TableHead>
              <TableHead>Jejak Aktivitas</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                  Belum ada data partisipan yang didaftarkan.
                </TableCell>
              </TableRow>
            ) : (
              pagination.paginatedData.map((user, index) => {
                const rowIndex = (pagination.currentPage - 1) * 15 + index + 1
                return (
                <TableRow key={user.id}>
                  <TableCell>{rowIndex}</TableCell>
                  <TableCell className="font-medium max-w-[150px] sm:max-w-[200px] md:max-w-[250px] truncate" title={user.email}>{user.email}</TableCell>
                  <TableCell>
                    <Badge className="w-full" variant={user.role === 'SYSTEM_ADMIN' ? 'destructive' : user.role === 'ADMIN_CABANG' ? 'default' : 'secondary'}>
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[150px] sm:max-w-[200px] md:max-w-[250px] truncate" title={user.commissariat_name || 'Pusat Cabang'}>
                    {user.commissariat_name ? user.commissariat_name : <span className="text-muted-foreground italic">Pusat Cabang</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : 'Belum Pernah'}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.id !== currentUserId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isPending && resetId === user.id}>
                            {isPending && resetId === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <form action={formAction}>
                            <input type="hidden" name="userId" value={user.id} />
                            <DropdownMenuItem asChild>
                              <button 
                                type="submit" 
                                className="w-full cursor-pointer flex items-center text-amber-600 focus:text-amber-700 focus:bg-amber-100/50 dark:focus:bg-amber-950/50"
                                onClick={() => setResetId(user.id)}
                              >
                                <KeyRound className="mr-2 h-4 w-4" />
                                Paksa Reset Sandi
                              </button>
                            </DropdownMenuItem>
                          </form>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        <SmartPagination {...pagination} />
      </div>
    </div>
  )
}
