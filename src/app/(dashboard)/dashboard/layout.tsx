import { createClient } from '@/shared/api/supabase/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/widgets/layout/AppSidebar'
import { SiteHeader } from '@/widgets/layout/SiteHeader'
import {
  SidebarInset,
  SidebarProvider,
} from '@/shared/ui/Sidebar'
import { prisma } from '@/shared/api/prisma/client'

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

  // Fetch role securely from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  })
  
  const role = dbUser?.role || 'ADMIN_KOMISARIAT'
  const name = user.user_metadata?.name || user.email?.split('@')[0] || 'Admin'
  const email = user.email ?? ''

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name,
          email,
          avatar: user.user_metadata?.avatar_url ?? '',
        }}
        role={role}
      />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
