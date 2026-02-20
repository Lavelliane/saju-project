"use client";

import { Moon, MoonStar } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/helpers/utils";
import { BRAND } from "./fortune-colors";

interface FortuneLunarToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function FortuneLunarToggle({
  checked,
  onCheckedChange,
  disabled,
}: FortuneLunarToggleProps) {
  const t = useTranslations("Fortune");

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-border/50" />
        <span className="font-mono text-sm font-medium text-foreground/80 tracking-widest">
          {t("lunarCalendar")}
        </span>
        <div className="flex-1 h-px bg-border/50" />
      </div>
      <div className="flex flex-col items-center gap-0">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={t("lunarCalendar")}
          disabled={disabled}
          onClick={() => onCheckedChange(!checked)}
          className={cn(
            "flex size-14 items-center justify-center rounded-xl transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
            "disabled:pointer-events-none disabled:opacity-50",
            !disabled && "cursor-pointer",
          )}
          style={{
            color: checked ? BRAND.gold : "rgba(0,0,0,0.22)",
          }}
        >
          {checked ? (
            <MoonStar className="size-10" strokeWidth={1.8} fill="currentColor" />
          ) : (
            <Moon className="size-10" strokeWidth={1.5} />
          )}
        </button>
        <span
          className={cn(
            "font-mono text-xs font-medium tracking-widest transition-colors duration-200",
            checked ? "text-foreground" : "text-muted-foreground/60",
          )}
        >
          {checked ? t("yes") : t("no")}
        </span>
      </div>
    </div>
  );
}
