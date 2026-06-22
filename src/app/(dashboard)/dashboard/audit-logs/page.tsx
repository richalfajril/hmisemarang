import { prisma } from '@/shared/api/prisma/client'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/Table'
import { Badge } from '@/shared/ui/Badge'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/shared/ui/Pagination'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { ActivityIcon, ServerCrash } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'

export const metadata = {
  title: 'Audit Logs - HMI Cabang Semarang',
}

export default async function AuditLogsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser || (currentUser.role !== 'SYSTEM_ADMIN' && currentUser.role !== 'ADMIN_CABANG')) {
    redirect('/dashboard') // Komisariat tidak bisa akses
  }

  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 50
  const skip = (page - 1) * pageSize

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { created_at: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.auditLog.count(),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-6 space-y-6 w-full">
      <PageHeader
        title="Log Audit Sistem"
        description="Pusat pengawasan operasional. Merekam seluruh jejak perubahan entitas secara persisten (Append-Only)."
        icon={ActivityIcon}
      />

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Waktu Eksekusi</TableHead>
              <TableHead>Alamat IP</TableHead>
              <TableHead>Aktor (ID)</TableHead>
              <TableHead>Tindakan</TableHead>
              <TableHead>Target Entitas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <ServerCrash className="h-8 w-8 mb-2 opacity-20" />
                    Belum ada jejak aktivitas apa pun di sistem ini.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => {
                let badgeColor = 'default'
                if (log.action === 'DELETED') badgeColor = 'destructive'
                if (log.action === 'CREATED') badgeColor = 'outline'
                if (log.action === 'UPDATED') badgeColor = 'secondary'

                return (
                  <TableRow key={log.id} className="text-xs sm:text-sm">
                    <TableCell className="font-medium whitespace-nowrap">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: id })}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground max-w-[120px] sm:max-w-[150px] truncate" title={log.ip_address}>{log.ip_address}</TableCell>
                    <TableCell className="font-mono truncate max-w-[100px]" title={log.actor_id || 'System'}>
                      {log.actor_id ? `${log.actor_id.substring(0, 8)}...` : 'System'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={badgeColor as "default" | "secondary" | "destructive" | "outline"} className={`w-full ${log.action === 'CREATED' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}`}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{log.entity_type}</span>
                      <span className="text-muted-foreground ml-2 font-mono truncate hidden md:inline-block max-w-[120px] align-bottom" title={log.entity_id}>
                        ({log.entity_id.substring(0, 8)}...)
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={`/dashboard/audit-logs?page=${page - 1}`} />
                </PaginationItem>
              )}
              <PaginationItem>
                <span className="text-sm px-4">Halaman {page} dari {totalPages}</span>
              </PaginationItem>
              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href={`/dashboard/audit-logs?page=${page + 1}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
