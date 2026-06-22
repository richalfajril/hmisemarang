'use client'

import { useActionState } from 'react'
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
import { activatePeriodAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Power, Eye, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui/DropdownMenu'
import Link from 'next/link'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import { SmartPagination } from '@/shared/ui/SmartPagination'

type PeriodData = {
  id: string
  start_year: number
  end_year: number
  is_active: boolean
  _count?: { positions: number }
}

export function PeriodList({ items }: { items: PeriodData[] }) {
  const [, formAction, isPending] = useActionState(activatePeriodAction, initialActionState)
  
  const pagination = useClientPagination(items, 15)

  return (
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
                        <Button variant="ghost" size="icon" disabled={isPending}>
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
      <SmartPagination {...pagination} />
    </div>
  )
}
