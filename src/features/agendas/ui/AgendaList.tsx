'use client'

import { Agenda } from '@prisma/client'
import { Button } from '@/shared/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Edit, MoreHorizontal, Trash, Send } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui/DropdownMenu'
import Link from 'next/link'
import { Badge } from '@/shared/ui/Badge'
import { useTransition } from 'react'
import { softDeleteAgendaAction, submitAgendaAction } from '../api/actions'
import { toast } from 'sonner'
import { useClientPagination } from '@/shared/lib/hooks/useClientPagination'
import { SmartPagination } from '@/shared/ui/SmartPagination'

interface AgendaListProps {
  agendas: Agenda[]
}

const statusColorMap: Record<string, string> = {
  DRAFT: 'bg-slate-200 text-slate-700',
  SUBMITTED: 'bg-yellow-200 text-yellow-800',
  REVISION: 'bg-orange-200 text-orange-800',
  APPROVED: 'bg-blue-200 text-blue-800',
  PUBLISHED: 'bg-green-200 text-green-800',
  ARCHIVED: 'bg-red-200 text-red-800',
}

export function AgendaList({ agendas }: AgendaListProps) {
  const [isPending, startTransition] = useTransition()
  
  const pagination = useClientPagination(agendas, 15)

  const handleDelete = (agendaId: string) => {
    if (!window.confirm('Yakin ingin menghapus agenda ini?')) return

    startTransition(async () => {
      const result = await softDeleteAgendaAction(agendaId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  const handleSubmit = (agendaId: string) => {
    if (!window.confirm('Yakin ingin mengajukan agenda ini untuk di-review Cabang?')) return

    startTransition(async () => {
      const result = await submitAgendaAction(agendaId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No.</TableHead>
            <TableHead>Nama Acara</TableHead>
            <TableHead>Waktu Pelaksanaan</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agendas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Belum ada draf agenda.
              </TableCell>
            </TableRow>
          ) : (
            pagination.paginatedData.map((agenda, index) => {
              const rowIndex = (pagination.currentPage - 1) * 15 + index + 1
              return (
              <TableRow key={agenda.id}>
                <TableCell>{rowIndex}</TableCell>
                <TableCell className="font-medium max-w-[150px] sm:max-w-[200px] md:max-w-[250px] truncate" title={agenda.title}>{agenda.title}</TableCell>
                <TableCell>
                  {format(new Date(agenda.start_datetime), 'dd MMM yyyy, HH:mm', { locale: id })}
                </TableCell>
                <TableCell className="max-w-[100px] sm:max-w-[150px] truncate" title={agenda.location_name || '-'}>{agenda.location_name || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`w-full ${statusColorMap[agenda.status] || ''}`}>
                    {agenda.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      
                      <Link href={`/dashboard/agendas/${agenda.id}/edit`} prefetch>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Draf
                        </DropdownMenuItem>
                      </Link>

                      {agenda.status === 'DRAFT' && (
                        <DropdownMenuItem 
                          className="cursor-pointer text-blue-600 focus:text-blue-600"
                          onClick={() => handleSubmit(agenda.id)}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Ajukan Review
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem 
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => handleDelete(agenda.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Hapus (Soft Delete)
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
      <SmartPagination {...pagination} />
    </div>
  )
}
