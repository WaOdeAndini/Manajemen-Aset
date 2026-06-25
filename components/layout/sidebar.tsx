"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LandPlot, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { navItems, navItemsBawah } from "@/lib/nav";
import { navItemsStaf } from "@/lib/nav-staf";
import { useUser } from "@/components/providers/user-provider";
import { signOut } from "@/lib/supabase/actions";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useUser();
  const isStaf = user.role === "staf";
  const menuUtama = isStaf ? navItemsStaf : navItems;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <LandPlot className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-foreground">
            SIMA BAZNAS
          </p>
          <p className="text-[11px] text-sidebar-muted-foreground">
            Manajemen Aset
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 scrollbar-thin">
        <p className="px-2.5 pb-2 pt-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-muted-foreground">
          Menu Utama
        </p>
        <ul className="space-y-0.5">
          {menuUtama.map((item) => {
            const basePath = isStaf ? "/staf" : "/dashboard";
            const active =
              pathname === item.href ||
              (item.href !== basePath && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-ring" />
                  )}
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {!isStaf && (
          <>
            <p className="px-2.5 pb-2 pt-5 text-[11px] font-medium uppercase tracking-wider text-sidebar-muted-foreground">
              Lainnya
            </p>
            <ul className="space-y-0.5">
              {navItemsBawah.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3">
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-sidebar-accent/60"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user.fullName}
            </p>
            <p className="truncate text-[11px] text-sidebar-muted-foreground">
              {user.unitKerja || (user.role === "admin" ? "Administrator Aset" : "Staf")}
            </p>
          </div>
          <LogOut className="size-4 shrink-0 text-sidebar-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:flex">
      <SidebarContent />
    </aside>
  );
}
