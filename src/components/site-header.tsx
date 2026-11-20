"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/lib/auth/actions";
import { avatarUrl } from "@/lib/avatars";
import { initials } from "@/lib/format";
import type { User } from "@/lib/types";

const TITLES: Record<string, string> = {
  "/": "Overview",
  "/escrows": "Escrows",
  "/disputes": "Disputes",
  "/users": "Users",
  "/transactions": "Transactions",
  "/support": "Support",
  "/leads": "Leads",
  "/team": "Team",
};

function pageTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  const base = "/" + pathname.split("/")[1];
  return TITLES[base] ?? "Veritas Admin";
}

export function SiteHeader({ user }: { user: User }) {
  const pathname = usePathname();
  const roleLabel = user.role === "admin" ? "Super Admin" : "Customer Care";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-sm font-semibold">{pageTitle(pathname)}</h1>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full outline-none ring-ring/50 focus-visible:ring-2">
                <Avatar className="size-8">
                  {user.avatar_seed ? <AvatarImage src={avatarUrl(user.avatar_seed)} alt="" /> : null}
                  <AvatarFallback className="bg-sidebar text-xs text-sidebar-foreground">
                    {initials(user.full_name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{user.full_name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                  <span className="text-xs text-muted-foreground">{roleLabel}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form action={logoutAction}>
                <DropdownMenuItem asChild>
                  <button type="submit" className="w-full">
                    <LogOut />
                    Log out
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
