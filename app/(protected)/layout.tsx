import { QueryProvider } from "@/providers/query-provider";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { CookieProvider } from "@/providers/cookie-provider";
import { DashboardHeader } from "./_components/dashboard-header";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <CookieProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="bg-muted/30">
            <DashboardHeader />
            <main className="flex-1 overflow-auto">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </CookieProvider>
    </QueryProvider>
  );
}
