'use client'

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
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { EyeIcon, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui/DropdownMenu'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import { SmartPagination } from '@/shared/ui/SmartPagination'
import Link from 'next/link'

type CadreVerificationData = {
  id: string
  file_url: string
  row_count: number | null
  status: string
  note: string | null
  created_at: Date
  commissariat: {
    name: string
  }
}

export function CadreVerificationTable({ items }: { items: CadreVerificationData[] }) {
  const pagination = useClientPagination(items, 15)

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No.</TableHead>
            <TableHead>Komisariat</TableHead>
            <TableHead>Tanggal Unggah</TableHead>
            <TableHead>Jumlah Kader</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                Belum ada riwayat verifikasi kader.
              </TableCell>
            </TableRow>
          ) : (
            pagination.paginatedData.map((item, index) => {
              const rowIndex = (pagination.currentPage - 1) * 15 + index + 1
              return (
              <TableRow key={item.id}>
                <TableCell>{rowIndex}</TableCell>
                <TableCell className="font-medium max-w-[150px] sm:max-w-[250px] md:max-w-[350px] truncate" title={item.commissariat.name}>{item.commissariat.name}</TableCell>
                <TableCell>
                  {format(new Date(item.created_at), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                </TableCell>
                <TableCell>
                  {item.status === 'VERIFIED' ? (
                    <span className="font-bold">{item.row_count || 0}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={item.status === 'VERIFIED' ? 'default' : (item.status === 'REJECTED' ? 'destructive' : 'secondary')}
                    className={`w-full ${item.status === 'VERIFIED' ? 'bg-green-500' : ''}`}
                  >
                    {item.status}
                  </Badge>
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
                      <Link href={`/dashboard/review-center/CADRE_VERIFICATION/${item.id}`}>
                        <DropdownMenuItem className="cursor-pointer">
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Detail
                        </DropdownMenuItem>
                      </Link>
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
    </div>
  )
}
