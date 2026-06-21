import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/Card'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Activity } from 'lucide-react'

interface RecentActivityWidgetProps {
  logs: Array<any>
}

export function RecentActivityWidget({ logs }: RecentActivityWidgetProps) {
  return (
    <Card className="col-span-1 lg:col-span-3 border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" /> Aktivitas Terkini
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Belum ada aktivitas tercatat.</p>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}
