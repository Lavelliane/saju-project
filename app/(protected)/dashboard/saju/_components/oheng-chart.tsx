"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/helpers/utils";
import type { OhengAnalysis } from "@/lib/saju/types";

const OHENG_CONFIG: Record<
  string,
  { label: string; hanja: string; color: string; bg: string; text: string }
> = {
  mok: {
    label: "Wood",
    hanja: "木",
    color: "bg-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  hwa: {
    label: "Fire",
    hanja: "火",
    color: "bg-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
  },
  to: {
    label: "Earth",
    hanja: "土",
    color: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
  },
  geum: {
    label: "Metal",
    hanja: "金",
    color: "bg-slate-400",
    bg: "bg-slate-50 dark:bg-slate-900/50",
    text: "text-slate-600 dark:text-slate-300",
  },
  su: {
    label: "Water",
    hanja: "水",
    color: "bg-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
  },
};

interface OhengChartProps {
  oheng: OhengAnalysis;
}

export function OhengChart({ oheng }: OhengChartProps) {
  const total = Object.values(oheng.balance).reduce((a, b) => a + b, 0);
  const elements = ["mok", "hwa", "to", "geum", "su"] as const;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span>⚖️</span> Five Elements Balance
          <span className="text-sm font-normal text-muted-foreground">(오행 분석)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2.5">
          {elements.map((key) => {
            const config = OHENG_CONFIG[key];
            if (!config) return null;
            const count = oheng.balance[key];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isStrongest = oheng.strongest === key;
            const isWeakest = oheng.weakest === key;
            const isMissing = oheng.missing.includes(key);

            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-base font-bold", config.text)}>{config.hanja}</span>
                    <span className="font-medium">{config.label}</span>
                    {isStrongest && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                        STRONGEST
                      </span>
                    )}
                    {isMissing && (
                      <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full font-semibold">
                        MISSING
                      </span>
                    )}
                    {isWeakest && !isMissing && (
                      <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full font-semibold">
                        WEAKEST
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground tabular-nums">
                    {count} / {pct}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", config.color)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 pt-1 border-t">
          <div
            className={cn(
              "flex-1 min-w-24 rounded-lg p-2 text-center",
              OHENG_CONFIG[oheng.strongest]?.bg ?? "bg-muted",
            )}
          >
            <div className="text-xs text-muted-foreground">Dominant</div>
            <div className={cn("text-sm font-bold", OHENG_CONFIG[oheng.strongest]?.text ?? "")}>
              {OHENG_CONFIG[oheng.strongest]?.hanja} {OHENG_CONFIG[oheng.strongest]?.label}
            </div>
          </div>
          {oheng.missing.length > 0 && (
            <div className="flex-1 min-w-24 rounded-lg p-2 text-center bg-destructive/5">
              <div className="text-xs text-muted-foreground">Missing</div>
              <div className="text-sm font-bold text-destructive">
                {oheng.missing
                  .map((k) => `${OHENG_CONFIG[k]?.hanja ?? ""} ${OHENG_CONFIG[k]?.label ?? ""}`)
                  .join(", ")}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
