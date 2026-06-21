import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Activity } from 'lucide-react'
import { Suspense } from 'react'
import { getRecentActivityLogs } from '@/widgets/dashboard/api/queries'
import { Skeleton } from '@/shared/ui/Skeleton'

export function RecentActivityWidget() {
  return (
    <Card className="col-span-1 lg:col-span-3 border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" /> Aktivitas Terkini
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        }>
          <RecentActivityData />
        </Suspense>
      </CardContent>
    </Card>
  )
}

async function RecentActivityData() {
  const logs = await getRecentActivityLogs(6)

  if (logs.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">Belum ada aktivitas tercatat.</p>
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-4">
          <div className="mt-0.5 rounded-full bg-primary/10 p-1.5 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              <span className="font-medium text-foreground">{log.actor?.name || 'Sistem'}</span>
              {' '} melakukan aksi {' '}
              <span className="font-medium text-foreground">{log.action}</span>
              {' '} pada entitas {' '}
              <span className="font-medium text-foreground">{log.entity_type}</span>.
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: idLocale })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
