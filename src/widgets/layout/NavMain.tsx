"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui/Sidebar"
import { useEffect, useRef } from "react"
import { type LucideIcon } from "lucide-react"

// Auto-close sidebar on desktop only when navigating to a sub-sub-page.
// All sidebar menu items live at depth 2 (/dashboard/xxx).
// Sub-sub-pages have depth 3+ (/dashboard/xxx/yyy),
// EXCEPT known section listing pages that should keep sidebar open.
const KEEP_OPEN_PATHS = ['/dashboard/organization/periods']

export function NavMain({
  items,
  label,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
  }[]
  label?: string
}) {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const { isMobile, setOpen } = useSidebar()

  useEffect(() => {
    // Auto-close sidebar on desktop (non-mobile) when navigating to a sub-sub-page.
    if (!isMobile && prevPathname.current !== pathname) {
      const segments = pathname?.split('/').filter(Boolean) || []
      const isSubSubPage = segments.length > 2
      const isAllowedSection = KEEP_OPEN_PATHS.some(p => pathname === p)
      if (isSubSubPage && !isAllowedSection) {
        setOpen(false)
      }
    }
    prevPathname.current = pathname
  }, [pathname, isMobile, setOpen])

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent className="flex flex-col gap-0.5">
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              item.url === "/dashboard"
                ? pathname === "/dashboard"
                : pathname?.startsWith(item.url) ?? false
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                  <Link href={item.url} prefetch>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
