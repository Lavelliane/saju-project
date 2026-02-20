"use client";

import { cn } from "@/lib/helpers/utils";
import type { Pillar } from "@/lib/saju/types";

const OHENG_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  mok: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  hwa: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    dot: "bg-red-500",
  },
  to: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  geum: {
    bg: "bg-slate-50 dark:bg-slate-900/50",
    text: "text-slate-600 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
  },
  su: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
  },
};

const OHENG_LABELS: Record<string, string> = {
  mok: "木 Wood",
  hwa: "火 Fire",
  to: "土 Earth",
  geum: "金 Metal",
  su: "水 Water",
};

const PILLAR_LABELS: Record<string, { ko: string; en: string; emoji: string }> = {
  year: { ko: "년주", en: "Year Pillar", emoji: "🌱" },
  month: { ko: "월주", en: "Month Pillar", emoji: "🌿" },
  day: { ko: "일주", en: "Day Pillar", emoji: "☀️" },
  hour: { ko: "시주", en: "Hour Pillar", emoji: "🌙" },
};

interface PillarCardProps {
  position: "year" | "month" | "day" | "hour";
  pillar: Pillar;
  stage?: { stage: string; hanja: string; description: string };
  className?: string;
}

const DEFAULT_OHENG_COLORS = {
  bg: "bg-muted",
  text: "text-muted-foreground",
  border: "border-muted",
  dot: "bg-muted-foreground",
};

export function PillarCard({ position, pillar, stage, className }: PillarCardProps) {
  const label = PILLAR_LABELS[position] ?? { ko: "", en: "", emoji: "" };
  const ganColors = OHENG_COLORS[pillar.cheongan.oheng] ?? DEFAULT_OHENG_COLORS;
  const jiColors = OHENG_COLORS[pillar.jiji.oheng] ?? DEFAULT_OHENG_COLORS;
  const isDayPillar = position === "day";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border overflow-hidden transition-all duration-200",
        isDayPillar ? "ring-2 ring-primary/40 shadow-md" : "shadow-sm hover:shadow-md",
        className,
      )}
    >
      {isDayPillar && (
        <div className="absolute top-2 right-2">
          <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
            DAY MASTER
          </span>
        </div>
      )}

      <div className="bg-muted/40 px-3 py-2 text-center border-b">
        <span className="text-base mr-1">{label.emoji}</span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label.en}
        </span>
        <div className="text-xs text-muted-foreground">{label.ko}</div>
      </div>

      <div className={cn("flex flex-col items-center py-4 px-3 gap-1", ganColors.bg)}>
        <span className="text-3xl font-bold tracking-tight">{pillar.cheongan.hanja}</span>
        <span className="text-lg font-medium">{pillar.cheongan.name}</span>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full border",
            ganColors.text,
            ganColors.border,
          )}
        >
          {OHENG_LABELS[pillar.cheongan.oheng]} · {pillar.cheongan.umyang}
        </span>
      </div>

      <div className="h-px bg-border" />

      <div className={cn("flex flex-col items-center py-4 px-3 gap-1", jiColors.bg)}>
        <span className="text-3xl font-bold tracking-tight">{pillar.jiji.hanja}</span>
        <span className="text-lg font-medium">{pillar.jiji.name}</span>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full border",
            jiColors.text,
            jiColors.border,
          )}
        >
          {OHENG_LABELS[pillar.jiji.oheng]} · {pillar.jiji.umyang}
        </span>
      </div>

      {stage && (
        <>
          <div className="h-px bg-border" />
          <div className="px-3 py-2 text-center bg-muted/20">
            <div className="text-xs text-muted-foreground">12운성</div>
            <div className="text-sm font-semibold">
              {stage.stage}{" "}
              <span className="text-muted-foreground font-normal">({stage.hanja})</span>
            </div>
            <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
              {stage.description}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
