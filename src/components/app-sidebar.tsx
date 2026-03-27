import * as React from "react"
import { 
  LayoutDashboard, 
  Plus, 
  Receipt, 
  Users, 
  Settings, 
  ShieldCheck
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Link } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "../hooks/useAuth"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const data = {
    user: {
      name: user?.hospitalName || "Hospital Staff",
      email: user?.email || "staff@carenow.com",
      avatar: "/avatars/hospital.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: <LayoutDashboard />,
      },
      {
        title: "Create Link",
        url: "/create-link",
        icon: <Plus />,
      },
      {
        title: "Payments",
        url: "/payments",
        icon: <Receipt />,
      },
      {
        title: "Patients",
        url: "/patients",
        icon: <Users />,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: <Settings />,
      },
      // {
      //   title: "Get Help",
      //   url: "#",
      //   icon: <LifeBuoy />,
      // },
      // {
      //   title: "Search",
      //   url: "#",
      //   icon: <Search />,
      // },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-black text-lg tracking-tight">CareNow</span>
                  <span className="truncate text-xs opacity-60">Hospital Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
