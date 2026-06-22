import { getUserSession } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { 
  getCabangDashboardStats, 
  getCommissariatDashboardStats, 
  getTopCommissariatsLeaderboard, 
  getRecentActivityLogs 
} from '@/widgets/dashboard/api/queries'
import { StatCard } from '@/widgets/dashboard/ui/StatCard'
import { LeaderboardWidget } from '@/widgets/dashboard/ui/LeaderboardWidget'
import { RecentActivityWidget } from '@/widgets/dashboard/ui/RecentActivityWidget'
import { PendingQueueWidget } from '@/widgets/dashboard/ui/PendingQueueWidget'
import { FileText, CalendarRange, Building2, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Dasbor - HMI Cabang Semarang',
}

export default async function DashboardOverview() {
  const session = await getUserSession()
  if (!session) redirect('/login')

  const { role, commissariatId, user_metadata } = session.user
  const name = user_metadata?.name || 'Admin'
  const isCabang = role === 'SYSTEM_ADMIN' || role === 'ADMIN_CABANG'

  return (
    <div className="p-6 space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Selamat Datang, {name}!</h1>
        <p className="text-muted-foreground mt-2">
          Berikut adalah ringkasan aktivitas {isCabang ? 'HMI Cabang Semarang' : 'Komisariat Anda'} saat ini.
        </p>
      </div>

      {isCabang ? (
        <CabangDashboard />
      ) : (
        <Suspense fallback={null}>
          <CommissariatDashboardSection commissariatId={commissariatId!} />
        </Suspense>
      )}
    </div>
  )
}

function CabangDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <Suspense fallback={null}>
        <CabangStatsSection />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-5">
        <CabangPendingSection />
        <CabangRecentActivitySection />
      </div>

      <div className="grid gap-6 grid-cols-1">
        <CabangLeaderboardSection />
      </div>
    </div>
  )
}

// Dynamic Sections that fetch their own data asynchronously
async function CabangStatsSection() {
  const stats = await getCabangDashboardStats()
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Artikel Publik"
        value={stats.totals.articles}
        icon={<FileText className="h-4 w-4" />}
        className="bg-card"
      />
      <StatCard
        title="Total Agenda"
        value={stats.totals.agendas}
        icon={<CalendarRange className="h-4 w-4" />}
      />
      <StatCard
        title="Total Dokumen"
        value={stats.totals.documents}
        icon={<BookOpen className="h-4 w-4" />}
      />
      <StatCard
        title="Total Komisariat"
        value={stats.totals.commissariats}
        icon={<Building2 className="h-4 w-4" />}
      />
    </div>
  )
}

function CabangPendingSection() {
  return <PendingQueueWidget />
}

function CabangRecentActivitySection() {
  return <RecentActivityWidget />
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card'

function CabangLeaderboardSection() {
  return (
    <Card className="col-span-1 lg:col-span-4 border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Top 5 Komisariat Teraktif
        </CardTitle>
        <CardDescription>
          Peringkat berdasarkan jumlah artikel yang berhasil dipublikasikan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={null}>
          <CabangLeaderboardData />
        </Suspense>
      </CardContent>
    </Card>
  )
}

async function CabangLeaderboardData() {
  const leaderboard = await getTopCommissariatsLeaderboard()
  return <LeaderboardWidget data={leaderboard} />
}

async function CommissariatDashboardSection({ commissariatId }: { commissariatId: string }) {
  const stats = await getCommissariatDashboardStats(commissariatId)

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Artikel Rilis"
          value={stats.articles.published}
          icon={<FileText className="h-4 w-4 text-green-500" />}
          description="Berhasil tayang di publik."
        />
        <StatCard
          title="Menunggu Review"
          value={stats.articles.draftsAndSubmitted + stats.agendas.draftsAndSubmitted + stats.pendingSystems.verifications + stats.pendingSystems.profiles}
          icon={<FileText className="h-4 w-4 text-amber-500" />}
          description="Menunggu persetujuan Cabang."
        />
        <StatCard
          title="Agenda Rilis"
          value={stats.agendas.published}
          icon={<CalendarRange className="h-4 w-4 text-primary" />}
          description="Aktivitas yang tayang ke publik."
        />
      </div>

      {stats.articles.rejected > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="font-medium">Ada {stats.articles.rejected} artikel Anda yang ditolak.</p>
          <p className="text-sm mt-1">Harap cek halaman Artikel Anda untuk melihat alasan penolakan dan melakukan revisi.</p>
        </div>
      )}
    </div>
  )
}
