"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
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
} from "@/shared/ui/Sidebar"
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

const ALL_ROLES = ["SYSTEM_ADMIN", "ADMIN_CABANG", "ADMIN_KOMISARIAT"]
const ADMIN_CABANG_ONLY = ["SYSTEM_ADMIN", "ADMIN_CABANG"]

const navMain = [
  { title: "Dasbor", url: "/dashboard", icon: <LayoutDashboardIcon />, roles: ALL_ROLES },
  { title: "Artikel", url: "/dashboard/articles", icon: <FileTextIcon />, roles: ALL_ROLES },
  { title: "Agenda", url: "/dashboard/agendas", icon: <CalendarRangeIcon />, roles: ALL_ROLES },
  { title: "Galeri", url: "/dashboard/galleries", icon: <ImageIcon />, roles: ADMIN_CABANG_ONLY },
  { title: "Dokumen", url: "/dashboard/documents", icon: <FileIcon />, roles: ADMIN_CABANG_ONLY },
  { title: "Review Center", url: "/dashboard/review-center", icon: <ClipboardCheckIcon />, roles: ADMIN_CABANG_ONLY },
]

const navManagement = [
  { title: "Manajemen Pengguna", url: "/dashboard/users", icon: <UsersIcon />, roles: ADMIN_CABANG_ONLY },
  { title: "Verifikasi Kader", url: "/dashboard/cadre-verification", icon: <UserCheckIcon />, roles: ALL_ROLES },
  { title: "Organisasi", url: "/dashboard/organization", icon: <BuildingIcon />, roles: ADMIN_CABANG_ONLY },
  { title: "Taksonomi", url: "/dashboard/taxonomy", icon: <TagsIcon />, roles: ADMIN_CABANG_ONLY },
]

const navSecondary = [
  { title: "Notifikasi", url: "/dashboard/notifications", icon: <BellIcon />, roles: ALL_ROLES },
  { title: "Pengaturan", url: "/dashboard/settings", icon: <Settings2Icon />, roles: ADMIN_CABANG_ONLY },
  { title: "Audit Log", url: "/dashboard/audit-logs", icon: <ScrollTextIcon />, roles: ADMIN_CABANG_ONLY },
]

export function AppSidebar({
  user,
  role,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar: string }
  role: string
}) {
  const filteredNavMain = navMain.filter((item) => item.roles.includes(role))
  const filteredNavManagement = navManagement.filter((item) => item.roles.includes(role))
  const filteredNavSecondary = navSecondary.filter((item) => item.roles.includes(role))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! h-14"
            >
              <Link href="/dashboard" prefetch className="flex items-center justify-start px-2">
                <div className="relative h-10 w-40 flex-shrink-0">
                  <Image
                    src="https://res.cloudinary.com/dbndgotx4/image/upload/v1782097475/Logo_White_Theme_dieii8.png"
                    alt="Logo"
                    fill
                    sizes="160px"
                    className="object-contain object-left dark:hidden"
                  />
                  <Image
                    src="https://res.cloudinary.com/dbndgotx4/image/upload/v1782097476/Logo_Dark_Theme_q1sfhq.png"
                    alt="Logo"
                    fill
                    sizes="160px"
                    className="object-contain object-left hidden dark:block"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} label="Konten" />
        {filteredNavManagement.length > 0 && <NavMain items={filteredNavManagement} label="Manajemen" />}
        <NavSecondary items={filteredNavSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
