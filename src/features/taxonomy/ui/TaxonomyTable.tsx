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
import { toggleTaxonomyStatusAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { Loader2, PowerOff, Power } from 'lucide-react'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import { SmartPagination } from '@/shared/ui/SmartPagination'

type TaxonomyData = {
  id: string
  name: string
  slug: string
  is_active: boolean
  _count?: { articles?: number, documents?: number }
}

export function TaxonomyTable({ items, type }: { items: TaxonomyData[], type: string }) {
  const [state, formAction, isPending] = useActionState(toggleTaxonomyStatusAction, initialActionState)
  
  const pagination = useClientPagination(items, 15)

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>URL Slug</TableHead>
            <TableHead>Penggunaan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                Belum ada data taksonomi terdaftar.
              </TableCell>
            </TableRow>
          ) : (
            pagination.paginatedData.map((item) => {
              const usageCount = item._count?.articles ?? item._count?.documents ?? 0
              
              return (
                <TableRow key={item.id} className={!item.is_active ? 'opacity-60 bg-muted/30' : ''}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{item.slug}</TableCell>
                  <TableCell>{usageCount} entri</TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                      {item.is_active ? 'Aktif' : 'Diarsipkan'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={formAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="type" value={type} />
                      <input type="hidden" name="currentStatus" value={String(item.is_active)} />
                      
                      <Button 
                        type="submit" 
                        variant="ghost" 
                        size="sm"
                        disabled={isPending}
                        className={item.is_active ? 'text-destructive hover:text-destructive hover:bg-destructive/10' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}
                      >
                        {item.is_active ? <PowerOff className="h-4 w-4 mr-2" /> : <Power className="h-4 w-4 mr-2" />}
                        {item.is_active ? 'Arsipkan' : 'Aktifkan'}
                      </Button>
                    </form>
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
