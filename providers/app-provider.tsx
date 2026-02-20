"use client";

import { CookieProvider } from "./cookie-provider";
import { QueryProvider } from "./query-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <CookieProvider>
      <QueryProvider>{children}</QueryProvider>
    </CookieProvider>
  );
}
