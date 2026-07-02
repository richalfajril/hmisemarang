'use client'

import { useActionState, useState } from 'react'
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
import { activatePeriodAction, archivePeriodAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Power, Eye, MoreHorizontal, Pencil, Trash2, Archive } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/DropdownMenu'
import Link from 'next/link'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import { SmartPagination } from '@/shared/ui/SmartPagination'
import { CreatePeriodModal } from './CreatePeriodModal'
import { DeletePeriodModal } from './DeletePeriodModal'
import { normalizeGroup } from './position-groups'

type PeriodData = {
  id: string
  start_year: number
  end_year: number
  is_active: boolean
  positions: { id: string; name: string; layout_type: string | null }[]
  _count?: { positions: number }
}

export function PeriodList({ items }: { items: PeriodData[] }) {
  const [, formAction, isPending] = useActionState(activatePeriodAction, initialActionState)
  const [, archiveAction, isArchivePending] = useActionState(archivePeriodAction, initialActionState)
  const [editItem, setEditItem] = useState<PeriodData | null>(null)
  const [deleteItem, setDeleteItem] = useState<PeriodData | null>(null)

  const pagination = useClientPagination(items, 15)

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No.</TableHead>
            <TableHead>Masa Jabatan</TableHead>
            <TableHead>Total Jabatan</TableHead>
            <TableHead>Status Publikasi</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                Belum ada data periode.
              </TableCell>
            </TableRow>
          ) : (
            pagination.paginatedData.map((item, index) => {
              const rowIndex = (pagination.currentPage - 1) * 15 + index + 1
              return (
                <TableRow key={item.id} className={item.is_active ? 'bg-primary/5' : ''}>
                  <TableCell>{rowIndex}</TableCell>
                  <TableCell className="font-medium font-mono">
                    {item.start_year} — {item.end_year}
                  </TableCell>
                  <TableCell>{item._count?.positions || 0} Posisi</TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? 'default' : 'outline'} className={`w-full ${item.is_active ? 'bg-green-600' : ''}`}>
                      {item.is_active ? 'Aktif (Tampil di Web)' : 'Arsip'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isPending || isArchivePending}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <Link href={`/dashboard/organization/periods/${item.id}`} prefetch>
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Susunan
                          </DropdownMenuItem>
                        </Link>
                        
                        {!item.is_active && (
                          <form action={formAction}>
                            <input type="hidden" name="id" value={item.id} />
                            <DropdownMenuItem asChild>
                              <button type="submit" className="w-full cursor-pointer flex items-center">
                                <Power className="mr-2 h-4 w-4 text-green-600" />
                                <span className="text-green-600">Aktifkan</span>
                              </button>
                            </DropdownMenuItem>
                          </form>
                        )}

                        {item.is_active && (
                          <form action={archiveAction}>
                            <input type="hidden" name="id" value={item.id} />
                            <DropdownMenuItem asChild>
                              <button type="submit" className="w-full cursor-pointer flex items-center text-amber-600 focus:text-amber-700 focus:bg-amber-50">
                                <Archive className="mr-2 h-4 w-4" />
                                Arsipkan
                              </button>
                            </DropdownMenuItem>
                          </form>
                        )}

                        <DropdownMenuItem onSelect={() => setEditItem(item)} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onSelect={() => setDeleteItem(item)}
                          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
      </div>
      <SmartPagination {...pagination} />

      {editItem && (
        <CreatePeriodModal
          key={editItem.id}
          open={true}
          onOpenChange={(o) => { if (!o) setEditItem(null) }}
          initial={{
            id: editItem.id,
            start_year: editItem.start_year,
            end_year: editItem.end_year,
            positions: editItem.positions.map((p) => ({
              id: p.id,
              name: p.name,
              layout: normalizeGroup(p.layout_type),
            })),
          }}
        />
      )}

      {deleteItem && (
        <DeletePeriodModal
          key={deleteItem.id}
          open={true}
          onOpenChange={(o) => { if (!o) setDeleteItem(null) }}
          item={{
            id: deleteItem.id,
            start_year: deleteItem.start_year,
            end_year: deleteItem.end_year,
            positionCount: deleteItem._count?.positions ?? 0,
          }}
        />
      )}
    </div>
  )
}
