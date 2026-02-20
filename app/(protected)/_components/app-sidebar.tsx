"use client";

import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  MapPin,
  Moon,
  Newspaper,
  PlusCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/auth/client";
import { cn } from "@/lib/helpers/utils";

const overviewItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "New Reading", href: "/dashboard/saju/new", icon: PlusCircle, exact: false },
  { label: "My Readings", href: "/dashboard/saju", icon: BookOpen, exact: true },
  { label: "Blog", href: "/dashboard/blog", icon: Newspaper, exact: false },
  { label: "Locations", href: "/dashboard/locations", icon: MapPin, exact: false },
];

const fortuneTellers = [
  {
    name: "Master Kim Jisoo",
    role: "Saju Specialist",
    initials: "KJ",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  },
  {
    name: "Grandmaster Park",
    role: "Tarot & Saju",
    initials: "GP",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  },
  {
    name: "Seer Choi Minjung",
    role: "Five Elements",
    initials: "CM",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  },
];

const settingsItems = [{ label: "Settings", href: "/dashboard/settings", icon: Settings }];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r bg-background">
      {/* Logo */}
      <SidebarHeader className="py-4 px-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="사주팔자">
              <Link href="/dashboard">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shrink-0">
                  <Moon className="size-4" />
                </div>
                <span className="font-bold text-base tracking-tight">사주팔자</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Overview */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1">
            Overview
          </SidebarGroupLabel>
          <SidebarMenu>
            {overviewItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.label}
                    className={cn(
                      "rounded-lg font-medium",
                      active
                        ? "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        {/* Fortune Tellers */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1">
            Fortune Tellers
          </SidebarGroupLabel>
          <SidebarMenu>
            {fortuneTellers.map((ft) => (
              <SidebarMenuItem key={ft.name}>
                <SidebarMenuButton
                  tooltip={ft.name}
                  className="text-muted-foreground hover:text-foreground rounded-lg h-auto py-2"
                >
                  <Avatar className="size-6 shrink-0">
                    <AvatarFallback className={cn("text-[10px] font-bold", ft.color)}>
                      {ft.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-xs font-medium text-foreground truncate">{ft.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate">{ft.role}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1">
            Settings
          </SidebarGroupLabel>
          <SidebarMenu>
            {settingsItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  className="text-muted-foreground hover:text-foreground rounded-lg"
                >
                  <Link href={item.href}>
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sign out"
                onClick={() => signOut()}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
              >
                <LogOut className="size-4 shrink-0" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter className="border-t p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={session?.user?.name ?? "User"}
              className="rounded-lg"
            >
              <Avatar className="size-7 shrink-0">
                <AvatarFallback className="text-xs bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1 leading-tight">
                <span className="text-xs font-semibold truncate">
                  {session?.user?.name ?? "User"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {session?.user?.email ?? ""}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
