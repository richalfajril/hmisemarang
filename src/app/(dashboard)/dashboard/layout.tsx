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
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, commissariat_id: true }
  })

  if (!dbUser && user.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { role: true, commissariat_id: true }
    })
  }
  
  const role = dbUser?.role || 'ADMIN_KOMISARIAT'
  let name = user.user_metadata?.name || user.email?.split('@')[0] || 'Admin'
  const email = user.email ?? ''
  let avatar = user.user_metadata?.avatar_url ?? 'https://res.cloudinary.com/dbndgotx4/image/upload/v1782097131/avatar_1-1_n1km33.avif'

  if (role === 'ADMIN_KOMISARIAT' && dbUser?.commissariat_id) {
    const commissariat = await prisma.commissariat.findUnique({
      where: { id: dbUser.commissariat_id },
      select: { name: true, logo_url: true }
    })
    if (commissariat) {
      name = commissariat.name
      if (commissariat.logo_url) avatar = commissariat.logo_url
    }
  }

  let dashboardLogoUrl: string | null = null
  try {
    const setting = await prisma.websiteSetting.findFirst({ select: { dashboard_logo_url: true } })
    dashboardLogoUrl = setting?.dashboard_logo_url ?? null
  } catch {
    // kolom belum ada / DB tak terjangkau → pakai logo default
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name,
          email,
          avatar,
        }}
        role={role}
        logoUrl={dashboardLogoUrl}
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
