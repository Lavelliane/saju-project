"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { useCookies } from "react-cookie";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/helpers/utils";
import { NAV } from "./fortune-colors";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸", short: "EN" },
  { code: "kr", name: "한국어", flag: "🇰🇷", short: "KR" },
] as const;

interface FortuneLanguageToggleProps {
  isDay: boolean;
}

export function FortuneLanguageToggle({ isDay }: FortuneLanguageToggleProps) {
  const router = useRouter();
  const currentLocale = useLocale();
  const [, setCookie] = useCookies(["locale"]);
  const [hovered, setHovered] = useState(false);

  const nav = isDay ? NAV.day : NAV.night;
  const current = LANGUAGES.find((l) => l.code === currentLocale) ?? LANGUAGES[0];

  const handleLanguageChange = (locale: string) => {
    setCookie("locale", locale, { path: "/", maxAge: 31536000, sameSite: "strict" });
    router.refresh();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl backdrop-blur-sm gap-2 px-4 py-2 transition-colors duration-200"
          style={{
            color: nav.color,
            background: hovered ? nav.hoverBg : nav.bg,
            border: `1px solid ${nav.border}`,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Languages className="size-4" />
          {current.short}
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-xl border border-border/60 bg-background/95 backdrop-blur-sm p-1.5 shadow-lg min-w-40"
      >
        {LANGUAGES.map((lang) => {
          const isSelected = currentLocale === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer outline-none",
                "focus:bg-transparent focus:text-inherit",
                isSelected
                  ? "text-white bg-[#2D5A43] data-highlighted:bg-[#245541] data-highlighted:text-white"
                  : "text-[#1a1a1a] data-highlighted:bg-[rgba(45,90,67,0.12)] data-highlighted:text-[#1a1a1a]",
              )}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
