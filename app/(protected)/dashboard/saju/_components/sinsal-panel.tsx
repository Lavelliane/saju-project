"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/helpers/utils";
import type { InterpretedSinsal } from "@/lib/saju/types";

const PILLAR_LABELS: Record<string, string> = {
  year: "年 Year",
  month: "月 Month",
  day: "日 Day",
  hour: "時 Hour",
};

const POWER_CONFIG: Record<string, { label: string; color: string; bars: number }> = {
  strong: { label: "Strong", color: "text-emerald-600 dark:text-emerald-400", bars: 4 },
  moderate: { label: "Moderate", color: "text-amber-600 dark:text-amber-400", bars: 3 },
  weak: { label: "Weak", color: "text-orange-500 dark:text-orange-400", bars: 2 },
  negligible: { label: "Negligible", color: "text-muted-foreground", bars: 1 },
};

const DEFAULT_POWER = { label: "Negligible", color: "text-muted-foreground", bars: 1 };

function PowerBars({ level }: { level: string }) {
  const config = POWER_CONFIG[level] ?? DEFAULT_POWER;
  return (
    <div className="flex gap-0.5 items-end h-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-sm transition-all",
            i <= config.bars
              ? level === "strong"
                ? "bg-emerald-500"
                : level === "moderate"
                  ? "bg-amber-500"
                  : level === "weak"
                    ? "bg-orange-500"
                    : "bg-muted-foreground"
              : "bg-muted",
          )}
          style={{ height: `${i * 25}%` }}
        />
      ))}
    </div>
  );
}

interface SinsalPanelProps {
  interpreted: InterpretedSinsal[];
}

export function SinsalPanel({ interpreted }: SinsalPanelProps) {
  const gilsin = interpreted
    .filter((i) => i.sinsal.type === "gilsin")
    .sort((a, b) => b.effectivePower - a.effectivePower);
  const hyungsin = interpreted
    .filter((i) => i.sinsal.type === "hyungsin")
    .sort((a, b) => b.effectivePower - a.effectivePower);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span>✨</span> Spiritual Influences
          <span className="text-sm font-normal text-muted-foreground">(신살 분석)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {gilsin.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
              길신 Auspicious ({gilsin.length})
            </div>
            <div className="space-y-2">
              {gilsin.map((item, i) => (
                <SinsalItem key={i} item={item} />
              ))}
            </div>
          </div>
        )}

        {hyungsin.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider">
              <span className="size-1.5 rounded-full bg-red-500 inline-block" />
              흉신 Inauspicious ({hyungsin.length})
            </div>
            <div className="space-y-2">
              {hyungsin.map((item, i) => (
                <SinsalItem key={i} item={item} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SinsalItem({ item }: { item: InterpretedSinsal }) {
  const isGilsin = item.sinsal.type === "gilsin";
  const powerConfig = POWER_CONFIG[item.powerLevel] ?? DEFAULT_POWER;

  return (
    <div
      className={cn(
        "rounded-lg border p-3 space-y-1.5 transition-colors",
        isGilsin
          ? "border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20"
          : "border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20",
        item.powerLevel === "negligible" && "opacity-60",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-sm shrink-0">{item.sinsal.name}</span>
          <span className="text-xs text-muted-foreground shrink-0">{item.sinsal.hanja}</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
            {PILLAR_LABELS[item.sinsal.pillar]}
          </Badge>
          {item.isGongmang && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 border-orange-300 text-orange-600 shrink-0"
            >
              공망
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <PowerBars level={item.powerLevel} />
          <span className={cn("text-xs font-medium tabular-nums", powerConfig.color)}>
            {Math.round(item.effectivePower * 100)}%
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{item.interpretation}</p>
    </div>
  );
}
