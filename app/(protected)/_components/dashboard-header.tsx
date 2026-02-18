"use client";

import { Bell, Mail, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/lib/auth/client";

export function DashboardHeader() {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="-ml-1 text-muted-foreground" />

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search your readings..."
          className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1 text-sm"
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Mail className="size-4" />
        </button>
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-violet-500" />
        </button>

        <div className="flex items-center gap-2.5 ml-2 pl-3 border-l">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs font-bold bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-semibold">{session?.user?.name ?? "User"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
