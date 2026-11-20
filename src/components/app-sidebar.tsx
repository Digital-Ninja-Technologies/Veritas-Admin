"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileStack,
  Gavel,
  Users,
  Receipt,
  LifeBuoy,
  UserCog,
  Inbox,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logoutAction } from "@/lib/auth/actions";
import type { UserRole } from "@/lib/types";

const SUPER_ADMIN_NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/escrows", label: "Escrows", icon: FileStack },
  { href: "/disputes", label: "Disputes", icon: Gavel },
  { href: "/users", label: "Users", icon: Users },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/support", label: "Support", icon: LifeBuoy },
  { href: "/leads", label: "Leads", icon: Inbox },
  { href: "/team", label: "Team", icon: UserCog },
];

const CUSTOMER_CARE_NAV = [{ href: "/support", label: "Support", icon: LifeBuoy }];

export function AppSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const navItems = role === "customer_care" ? CUSTOMER_CARE_NAV : SUPER_ADMIN_NAV;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="relative h-5 w-8 shrink-0">
            <span className="absolute left-0 top-0 h-5 w-5 rounded-full border-[2.4px] border-sidebar-foreground" />
            <span className="absolute left-3 top-0 h-5 w-5 rounded-full border-[2.4px] border-sidebar-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Veritas
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={logoutAction}>
              <SidebarMenuButton type="submit" tooltip="Log out">
                <LogOut />
                <span>Log out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
