"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CookieProvider } from "@/components/cookie-provider";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/helpers/utils";
import { LanguageToggle } from "./LanguageToggle";
import { ModeToggle } from "./ModeToggle";

const SAJU_SUBNAV = [
  { title: "Home", href: "/" },
  { title: "About Saju", href: "/#about" },
  { title: "Services", href: "/#services" },
  { title: "FAQ", href: "/#faq" },
];

const NAV_LINKS = [
  { title: "Fortune Reading", href: "/fortune" },
  { title: "Pricing", href: "/pricing" },
  { title: "Terms", href: "/terms" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const hash = href.split("#")[1];
    if (!hash) return;

    if (pathname === "/") {
      e.preventDefault();
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      e.preventDefault();
      router.push(href);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const navLinkBase =
    "nav-link text-muted-foreground hover:text-foreground transition-colors duration-200";

  /* ─── Mobile nav ─── */
  if (isMobile) {
    return (
      <CookieProvider>
        <nav className="flex items-center justify-between w-full h-14 sm:h-16">
          <Link href="/" aria-label="Go to homepage" className="flex items-center gap-1.5 group">
            <span className="w-1 h-4 rounded-full bg-primary transition-all group-hover:h-5" />
            <span className="nav-brand text-foreground">SAJU</span>
          </Link>

          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/5"
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent
              side="right"
              className="w-80 border-l border-border/60 bg-background dark:bg-card"
            >
              <SheetHeader className="border-b border-border/40 pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-primary" />
                  <span className="nav-brand text-foreground">SAJU</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-0.5 pt-6">
                <p className="nav-link text-muted-foreground px-3 mb-2">Explore</p>
                {SAJU_SUBNAV.map((item) => (
                  <SheetClose asChild key={item.title}>
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        handleAnchorClick(e, item.href);
                        setMobileOpen(false);
                      }}
                      className={cn(
                        navLinkBase,
                        "px-4 py-3 rounded-lg hover:bg-primary/5 hover:text-primary",
                      )}
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                ))}
              </div>

              <div className="flex flex-col gap-0.5 pt-4">
                <p className="nav-link text-muted-foreground px-3 mb-2">Pages</p>
                {NAV_LINKS.map((item) => (
                  <SheetClose asChild key={item.title}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        navLinkBase,
                        "px-4 py-3 rounded-lg hover:bg-primary/5 hover:text-primary",
                      )}
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-6 mt-auto border-t border-border/40">
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full rounded-xl border-border/60 hover:bg-primary/5 hover:border-primary/30 hover:text-primary"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild className="w-full rounded-xl shadow-glow" size="lg">
                    <Link href="/register">Get Started — Free</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </CookieProvider>
    );
  }

  /* ─── Desktop nav ─── */
  return (
    <CookieProvider>
      <nav className="flex items-center justify-between w-full h-16">
        <Link
          href="/"
          aria-label="Go to homepage"
          className="flex items-center gap-2 group shrink-0"
        >
          <span className="w-1 h-5 rounded-full bg-primary transition-all group-hover:h-6 group-hover:bg-primary/80" />
          <span className="nav-brand text-foreground">SAJU</span>
        </Link>

        <NavigationMenu className="flex-1 justify-center hidden md:flex">
          <NavigationMenuList className="gap-1 list-none">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="nav-link bg-transparent border-0 h-auto data-[state=open]:bg-primary/5">
                SAJU
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-44 p-2">
                <div className="flex flex-col gap-0.5">
                  {SAJU_SUBNAV.map((item) => (
                    <NavigationMenuLink asChild key={item.title}>
                      <Link
                        href={item.href}
                        onClick={(e) => handleAnchorClick(e, item.href)}
                        className={cn(
                          navLinkBase,
                          "group flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-primary/5 hover:text-primary",
                        )}
                      >
                        <span className="w-px h-3 bg-primary/30 opacity-60 group-hover:opacity-100 transition-opacity" />
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {NAV_LINKS.map((item) => (
              <NavigationMenuItem key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    navLinkBase,
                    "inline-flex items-center px-4 py-2 rounded-lg hover:bg-primary/5",
                  )}
                >
                  {item.title}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-muted/30 border border-border/40">
            <LanguageToggle />
            <ModeToggle />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-primary/5"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="rounded-xl shadow-glow px-5">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>
    </CookieProvider>
  );
}
