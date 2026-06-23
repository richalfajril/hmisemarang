'use client'

import { usePathname } from 'next/navigation'
import { Separator } from "@/shared/ui/Separator"
import { SidebarTrigger } from "@/shared/ui/Sidebar"
import { GlobalSearch } from "@/features/search/ui/GlobalSearch"
import { NotificationBell } from "@/features/notifications/ui/NotificationBell"

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dasbor',
  '/dashboard/articles': 'Artikel',
  '/dashboard/agendas': 'Agenda',
  '/dashboard/galleries': 'Galeri',
  '/dashboard/documents': 'Dokumen',
  '/dashboard/review-center': 'Review Center',
  '/dashboard/users': 'Manajemen Pengguna',
  '/dashboard/cadre-verification': 'Verifikasi Kader',
  '/dashboard/organization': 'Organisasi',
  '/dashboard/taxonomy': 'Taksonomi',
  '/dashboard/notifications': 'Notifikasi',
  '/dashboard/settings': 'Pengaturan',
  '/dashboard/audit-logs': 'Audit Log',
  '/dashboard/profile': 'Profil Komisariat',
}

function getPageTitle(pathname: string | null): string {
  if (!pathname) return 'Dasbor'
  
  // Exact match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  
  // Find longest matching prefix
  const sorted = Object.keys(PAGE_TITLES).sort((a, b) => b.length - a.length)
  for (const key of sorted) {
    if (pathname.startsWith(key)) return PAGE_TITLES[key]
  }
  
  return 'Dasbor'
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)
  
  return (
    <header className="flex h-(--header-height) py-2 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-3">
          <GlobalSearch />
          <NotificationBell />
        </div>
      </div>
    </header>
  )
}
