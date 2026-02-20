"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCookies } from "react-cookie";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "kr", name: "한국어", flag: "🇰🇷" },
];

export function LanguageToggle() {
  const router = useRouter();
  const currentLocale = useLocale();
  const [, setCookie] = useCookies(["locale"]);

  const handleLanguageChange = (locale: string) => {
    // Set the locale cookie using react-cookie
    setCookie("locale", locale, {
      path: "/",
      maxAge: 31536000, // 1 year
      sameSite: "strict",
    });

    // Refresh the page to apply the new locale
    router.refresh();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/5 border-0"
        >
          <Languages className="size-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-xl border-border/60 bg-popover/95 backdrop-blur-xl shadow-glass"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLocale === language.code ? "bg-primary/10 text-primary" : ""}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
