import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Inbox, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { getCabangDashboardStats } from '@/widgets/dashboard/api/queries'
import { Skeleton } from '@/shared/ui/Skeleton'

export function PendingQueueWidget() {
  return (
    <Card className="col-span-1 lg:col-span-2 border shadow-sm bg-gradient-to-br from-card to-amber-500/5 dark:to-amber-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
          <Inbox className="h-5 w-5" /> Antrean Review Center
        </CardTitle>
        <CardDescription>Menunggu persetujuan Cabang.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={
          <div>
            <Skeleton className="h-10 w-16 mb-4" />
            <div className="grid grid-cols-2 gap-2 mb-6">
              <Skeleton className="h-9 w-full rounded" />
              <Skeleton className="h-9 w-full rounded" />
              <Skeleton className="h-9 w-full rounded" />
              <Skeleton className="h-9 w-full rounded" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        }>
          <PendingQueueData />
        </Suspense>
      </CardContent>
    </Card>
  )
}

async function PendingQueueData() {
  const fullStats = await getCabangDashboardStats()
  const stats = fullStats.pendingReview

  return (
    <>
      <div className="text-4xl font-bold mb-4">{stats.total}</div>
      <div className="grid grid-cols-2 gap-2 mb-6">
        <div className="flex justify-between items-center bg-background/50 p-2 rounded text-sm">
          <span className="text-muted-foreground">Artikel</span>
          <span className="font-medium">{stats.articles}</span>
        </div>
        <div className="flex justify-between items-center bg-background/50 p-2 rounded text-sm">
          <span className="text-muted-foreground">Agenda</span>
          <span className="font-medium">{stats.agendas}</span>
        </div>
        <div className="flex justify-between items-center bg-background/50 p-2 rounded text-sm">
          <span className="text-muted-foreground">Kader</span>
          <span className="font-medium">{stats.verifications}</span>
        </div>
        <div className="flex justify-between items-center bg-background/50 p-2 rounded text-sm">
          <span className="text-muted-foreground">Profil</span>
          <span className="font-medium">{stats.profiles}</span>
        </div>
      </div>
      <Link href="/dashboard/review-center">
        <Button className="w-full" variant="outline">
          Buka Review Center <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </>
  )
}
