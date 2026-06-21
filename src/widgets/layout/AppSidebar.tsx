"use client"

import * as React from "react"
import Link from "next/link"
import { NavMain } from "@/widgets/layout/NavMain"
import { NavSecondary } from "@/widgets/layout/NavSecondary"
import { NavUser } from "@/widgets/layout/NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar"
import {
  LayoutDashboardIcon,
  FileTextIcon,
  CalendarRangeIcon,
  ImageIcon,
  FileIcon,
  UsersIcon,
  BuildingIcon,
  TagsIcon,
  ClipboardCheckIcon,
  Settings2Icon,
  ScrollTextIcon,
  UserCheckIcon,
  BellIcon,
} from "lucide-react"

const navMain = [
  { title: "Dasbor", url: "/dashboard", icon: <LayoutDashboardIcon /> },
  { title: "Artikel", url: "/dashboard/articles", icon: <FileTextIcon /> },
  { title: "Agenda", url: "/dashboard/agendas", icon: <CalendarRangeIcon /> },
  { title: "Galeri", url: "/dashboard/galleries", icon: <ImageIcon /> },
  { title: "Dokumen", url: "/dashboard/documents", icon: <FileIcon /> },
  { title: "Review Center", url: "/dashboard/review-center", icon: <ClipboardCheckIcon /> },
]

const navManagement = [
  { title: "Manajemen Pengguna", url: "/dashboard/users", icon: <UsersIcon /> },
  { title: "Verifikasi Kader", url: "/dashboard/cadre-verification", icon: <UserCheckIcon /> },
  { title: "Organisasi", url: "/dashboard/organization", icon: <BuildingIcon /> },
  { title: "Taksonomi", url: "/dashboard/taxonomy", icon: <TagsIcon /> },
]

const navSecondary = [
  { title: "Notifikasi", url: "/dashboard/notifications", icon: <BellIcon /> },
  { title: "Pengaturan", url: "/dashboard/settings", icon: <Settings2Icon /> },
  { title: "Audit Log", url: "/dashboard/audit-logs", icon: <ScrollTextIcon /> },
]

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar: string }
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <span className="flex size-5 items-center justify-center rounded-sm bg-primary text-primary-foreground text-xs font-bold">
                  H
                </span>
                <span className="text-base font-semibold">HMI Semarang CMS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} label="Konten" />
        <NavMain items={navManagement} label="Manajemen" />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
