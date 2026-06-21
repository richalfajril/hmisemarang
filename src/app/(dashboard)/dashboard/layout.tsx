import { createClient } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { NotificationBell } from '@/features/notifications/ui/NotificationBell'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-6xl mx-auto items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-bold tracking-tight">
              HMI CMS
            </Link>
            <nav className="hidden md:flex gap-4 text-sm font-medium text-muted-foreground">
              <Link href="/dashboard/organization" className="hover:text-foreground">Organisasi</Link>
              <Link href="/dashboard/taxonomy" className="hover:text-foreground">Taksonomi</Link>
              <Link href="/dashboard/settings" className="hover:text-foreground">Pengaturan</Link>
              <Link href="/dashboard/audit-logs" className="hover:text-foreground">Audit Log</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <form action="/auth/logout" method="post">
              <button type="submit" className="text-sm font-medium hover:underline">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-muted/10">
        {children}
      </main>
    </div>
  )
}
