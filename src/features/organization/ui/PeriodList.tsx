'use client'

import { useActionState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/ui/Table'
import { Badge } from '@/shared/ui/ui/Badge'
import { Button } from '@/shared/ui/ui/Button'
import { activatePeriodAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Loader2, Power, Eye } from 'lucide-react'
import Link from 'next/link'

type PeriodData = {
  id: string
  start_year: number
  end_year: number
  is_active: boolean
  _count?: { positions: number }
}

export function PeriodList({ items }: { items: PeriodData[] }) {
  const [state, formAction, isPending] = useActionState(activatePeriodAction, initialActionState)
  
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Masa Jabatan</TableHead>
            <TableHead>Total Jabatan</TableHead>
            <TableHead>Status Publikasi</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                Belum ada data periode.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              return (
                <TableRow key={item.id} className={item.is_active ? 'bg-primary/5' : ''}>
                  <TableCell className="font-medium font-mono">
                    {item.start_year} — {item.end_year}
                  </TableCell>
                  <TableCell>{item._count?.positions || 0} Posisi</TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? 'default' : 'outline'} className={item.is_active ? 'bg-green-600' : ''}>
                      {item.is_active ? 'Aktif (Tampil di Web)' : 'Arsip'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Link href={`/dashboard/organization/periods/${item.id}`} className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Susunan
                        </Link>
                      </Button>
                      
                      {!item.is_active && (
                        <form action={formAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <Button 
                            type="submit" 
                            variant="secondary" 
                            size="sm"
                            disabled={isPending}
                          >
                            <Power className="h-4 w-4 mr-2 text-green-600" />
                            Aktifkan
                          </Button>
                        </form>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
