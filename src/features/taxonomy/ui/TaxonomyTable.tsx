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
import { toggleTaxonomyStatusAction } from '../api/actions'
import { initialActionState } from '@/shared/lib/action-state'
import { PowerOff, Power, MoreHorizontal, Pencil } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui/DropdownMenu'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import { SmartPagination } from '@/shared/ui/SmartPagination'
import { EditTaxonomyModal } from './EditTaxonomyModal'

type TaxonomyType = 'ARTICLE_CATEGORY' | 'DOCUMENT_CATEGORY' | 'TAG' | 'UNIVERSITY'

type TaxonomyData = {
  id: string
  name: string
  slug: string
  is_active: boolean
  _count?: { articles?: number, documents?: number }
}

export function TaxonomyTable({ items, type, label }: { items: TaxonomyData[], type: TaxonomyType, label: string }) {
  const [, formAction, isPending] = useActionState(toggleTaxonomyStatusAction, initialActionState)
  const [editItem, setEditItem] = useState<TaxonomyData | null>(null)

  const pagination = useClientPagination(items, 15)

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No.</TableHead>
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
              <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                Belum ada data taksonomi terdaftar.
              </TableCell>
            </TableRow>
          ) : (
            pagination.paginatedData.map((item, index) => {
              const usageCount = item._count?.articles ?? item._count?.documents ?? 0
              const rowIndex = (pagination.currentPage - 1) * 15 + index + 1
              
              return (
                <TableRow key={item.id} className={!item.is_active ? 'opacity-60 bg-muted/30' : ''}>
                  <TableCell>{rowIndex}</TableCell>
                  <TableCell className="font-medium max-w-[150px] sm:max-w-[250px] md:max-w-[350px] truncate" title={item.name}>{item.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{item.slug}</TableCell>
                  <TableCell>{usageCount} entri</TableCell>
                  <TableCell>
                    <Badge className="w-full" variant={item.is_active ? 'default' : 'secondary'}>
                      {item.is_active ? 'Aktif' : 'Diarsipkan'}
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
                        <DropdownMenuItem
                          onSelect={() => setEditItem(item)}
                          className="cursor-pointer"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <form action={formAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="type" value={type} />
                          <input type="hidden" name="currentStatus" value={String(item.is_active)} />
                          
                          <DropdownMenuItem asChild>
                            <button 
                              type="submit" 
                              className={`w-full cursor-pointer flex items-center ${item.is_active ? 'text-destructive focus:text-destructive focus:bg-destructive/10' : 'text-green-600 focus:text-green-700 focus:bg-green-50'}`}
                            >
                              {item.is_active ? <PowerOff className="h-4 w-4 mr-2" /> : <Power className="h-4 w-4 mr-2" />}
                              {item.is_active ? 'Arsipkan' : 'Aktifkan'}
                            </button>
                          </DropdownMenuItem>
                        </form>
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

      {editItem && (
        <EditTaxonomyModal
          key={editItem.id}
          open={true}
          onOpenChange={(o) => { if (!o) setEditItem(null) }}
          item={editItem}
          type={type}
          label={label}
        />
      )}
    </div>
  )
}
