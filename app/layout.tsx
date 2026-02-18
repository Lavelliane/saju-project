import type { Metadata } from "next";
import { AppProvider } from "@/providers";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  title: "Saju - Korean Fortune Reading",
  description: "Discover your destiny through traditional Korean fortune telling with Saju",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{ scrollBehavior: "smooth" }}
        className={` antialiased min-h-screen bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <AppProvider>
              <main suppressHydrationWarning>{children}</main>
            </AppProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
