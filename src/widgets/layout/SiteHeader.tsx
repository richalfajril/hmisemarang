import { Separator } from "@/shared/ui/Separator"
import { SidebarTrigger } from "@/shared/ui/Sidebar"
import { GlobalSearch } from "@/features/search/ui/GlobalSearch"
import { NotificationBell } from "@/features/notifications/ui/NotificationBell"

export function SiteHeader({ title = "Dasbor" }: { title?: string }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:block">
            <GlobalSearch />
          </div>
          <NotificationBell />
        </div>
      </div>
    </header>
  )
}
