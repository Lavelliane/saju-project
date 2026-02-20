"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";

export function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/fortune";

  return (
    <main className="w-full">
      {!hideNavbar && (
        <header className="sticky top-0 z-50 w-full">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl border-b border-border/40 shadow-[0_1px_0_0_rgba(255,255,255,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.04)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <Navbar />
          </div>
        </header>
      )}
      {children}
    </main>
  );
}
