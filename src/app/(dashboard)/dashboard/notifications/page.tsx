import { prisma } from '@/shared/api/prisma/client'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/supabase/server'
import { BellIcon, MailOpen, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import Link from 'next/link'
import { Button } from '@/shared/ui/Button'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/shared/ui/Pagination'
import { markAllAsReadAction } from '@/features/notifications/api/actions'

import { PageHeader } from '@/shared/ui/PageHeader'

export const metadata = {
  title: 'Semua Notifikasi - HMI Cabang Semarang',
}

export default async function NotificationsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const currentUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!currentUser) redirect('/dashboard')

  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { user_id: currentUser.id },
      orderBy: { created_at: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.notification.count({ where: { user_id: currentUser.id } }),
  ])

  const totalPages = Math.ceil(total / pageSize)
  const hasUnread = notifications.some(n => !n.is_read)

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <PageHeader
        title="Pusat Notifikasi"
        description="Riwayat lengkap pemberitahuan sistem dan pembaruan alur persetujuan konten Anda."
        icon={BellIcon}
      >
        {hasUnread && (
          <form action={async () => { await markAllAsReadAction(); }}>
            <Button type="submit" variant="outline">
              <CheckCheck className="mr-2 h-4 w-4" />
              Tandai Semua Terbaca
            </Button>
          </form>
        )}
      </PageHeader>

      <div className="bg-card rounded-xl border shadow-sm divide-y overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <MailOpen className="h-12 w-12 mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-medium">Kosong</h3>
            <p className="text-muted-foreground">Belum ada notifikasi apa pun untuk Anda.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={`p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center transition-colors hover:bg-muted/30 ${!notif.is_read ? 'bg-primary/5' : ''}`}>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {!notif.is_read && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />}
                  <h4 className={`text-base font-semibold ${!notif.is_read ? 'text-foreground' : 'text-foreground/80'}`}>
                    {notif.title}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">{notif.message}</p>
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
                  <span>{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: idLocale })}</span>
                  <span className="capitalize px-1.5 py-0.5 rounded-sm bg-muted/50 border">
                    {notif.type}
                  </span>
                </div>
              </div>

              {notif.link_url && (
                <div className="sm:ml-auto">
                  <Button variant="secondary" size="sm">
                    <Link href={notif.link_url} className="flex h-full w-full items-center justify-center">
                      Buka Tautan
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={`/dashboard/notifications?page=${page - 1}`} />
                </PaginationItem>
              )}
              <PaginationItem>
                <span className="text-sm px-4">Halaman {page} dari {totalPages}</span>
              </PaginationItem>
              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href={`/dashboard/notifications?page=${page + 1}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
