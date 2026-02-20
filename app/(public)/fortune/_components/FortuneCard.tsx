"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/helpers/utils";
import type { InterpretedAnalysis } from "@/lib/saju/types/analysis";
import { BRAND, KNOB_ACCENT } from "./fortune-colors";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const OHENG: Record<string, { symbol: string; color: string; bg: string }> = {
  mok: { symbol: "木", color: "#16a34a", bg: "rgba(22,163,74,0.10)" },
  hwa: { symbol: "火", color: "#dc2626", bg: "rgba(220,38,38,0.10)" },
  to: { symbol: "土", color: "#d97706", bg: "rgba(217,119,6,0.10)" },
  geum: { symbol: "金", color: "#64748b", bg: "rgba(100,116,139,0.10)" },
  su: { symbol: "水", color: "#2563eb", bg: "rgba(37,99,235,0.10)" },
};

interface FortuneCardProps {
  name: string;
  birthDate: string;
  analysis: InterpretedAnalysis;
  hour: number;
}

const PILLAR_KOREAN: Record<string, string> = { year: "年", month: "月", day: "日", hour: "時" };

export function FortuneCard({ name, birthDate, analysis, hour }: FortuneCardProps) {
  void hour; // passed from parent for API consistency
  const t = useTranslations("Fortune");
  const { saju, oheng, interpreted } = analysis;
  /* Text colours — high contrast for readability on card background */
  const headCol = "#0f0f0f";
  const bodyCol = "#1a1a1a";
  const mutedCol = "rgba(25,25,25,0.72)"; /* secondary text — was 0.50, boosted for clarity */
  const labelCol = "rgba(35,35,35,0.88)";

  const pillars = [
    { key: "year", pillar: saju.yearPillar, isDay: false, accent: KNOB_ACCENT.year },
    { key: "month", pillar: saju.monthPillar, isDay: false, accent: KNOB_ACCENT.month },
    { key: "day", pillar: saju.dayPillar, isDay: true, accent: KNOB_ACCENT.day },
    { key: "hour", pillar: saju.hourPillar, isDay: false, accent: BRAND.gold },
  ];

  const strongInfluences = interpreted
    .filter((i) => i.powerLevel === "strong" || i.powerLevel === "moderate")
    .slice(0, 3);

  const ohengTotal = Object.values(oheng.balance).reduce((a, b) => a + b, 0) || 1;
  const pillarBorder = "rgba(0,0,0,0.08)";
  const pillarBg = "rgba(255,255,255,0.65)";

  return (
    <motion.div
      initial={{ opacity: 0.6, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: EASE_OUT }}
      className="flex flex-col gap-3"
    >
      {/* ── Header ── */}
      <div className="relative overflow-hidden flex flex-col gap-4">
        {/* Decorative kanji watermark — subtle but visible, including over pillars */}
        <span
          aria-hidden
          className="absolute right-0 top-1/4 -translate-y-1/2 text-[2rem] font-bold text-white/20 leading-none select-none pointer-events-none sm:text-[7rem]"
        >
          命
        </span>

        {/* Name + date */}
        <div className="relative flex flex-col gap-2">
          <p className="label" style={{ color: labelCol }}>
            {t("sajuReading")}
          </p>
          <div className="flex flex-col gap-1">
            <h3
              className="truncate"
              style={{
                color: headCol,
                fontSize: "clamp(1.3rem,4vw,1.9rem)",
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {name}
            </h3>
            <p className="font-mono text-sm" style={{ color: bodyCol }}>
              {birthDate}
            </p>
          </div>
        </div>

        <Separator />
        {/* Day Master — full width, low height, clear and visible */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold shrink-0" style={{ color: bodyCol }}>
            {t("dayMaster")}
          </span>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-3xl font-bold leading-none shrink-0" style={{ color: headCol }}>
              {saju.dayPillar.cheongan.hanja}
            </span>
            <span className="text-sm font-semibold shrink-0" style={{ color: bodyCol }}>
              {saju.dayPillar.cheongan.name}
            </span>
            <span className="text-xs font-medium capitalize shrink-0" style={{ color: bodyCol }}>
              {saju.dayPillar.cheongan.umyang === "um" ? "Yin" : "Yang"}
              {OHENG[saju.dayPillar.cheongan.oheng] &&
                ` · ${OHENG[saju.dayPillar.cheongan.oheng].symbol}`}
            </span>
          </div>
        </div>
        <Separator />
      </div>

      {/* ── Four Pillars ── */}
      <div className="flex flex-col gap-3 py-3 sm:py-4">
        <p className="label" style={{ color: labelCol }}>
          {t("fourPillars")}
        </p>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {pillars.map((p, i) => {
            const gan = OHENG[p.pillar.cheongan.oheng];
            const ji = OHENG[p.pillar.jiji.oheng];
            const borderColor = p.isDay ? p.accent : pillarBorder;
            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: EASE_OUT }}
                className="flex flex-col rounded-xl overflow-hidden"
                style={{
                  background: pillarBg,
                  border: `1px solid ${borderColor}`,
                  borderTop: `4px solid ${p.accent}`,
                  boxShadow: p.isDay ? `inset 0 2px 0 0 ${p.accent}40` : undefined,
                }}
              >
                <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 text-center">
                  <span className="text-xl font-bold leading-none" style={{ color: p.accent }}>
                    {PILLAR_KOREAN[p.key]}
                  </span>
                  <span
                    className="text-[10px] font-mono uppercase tracking-widest"
                    style={{ color: mutedCol }}
                  >
                    {t(p.key)}
                  </span>
                </div>

                <div
                  className="flex flex-col items-center py-2.5 px-2 gap-1"
                  style={{ background: gan?.bg ?? "rgba(0,0,0,0.02)" }}
                >
                  <span className="text-2xl font-bold leading-none" style={{ color: headCol }}>
                    {p.pillar.cheongan.hanja}
                  </span>
                  <span
                    className="text-xs font-medium text-center leading-tight"
                    style={{ color: bodyCol }}
                  >
                    {p.pillar.cheongan.name}
                  </span>
                  {gan && (
                    <span
                      className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md border"
                      style={{
                        color: gan.color,
                        borderColor: `${gan.color}50`,
                        background: `${gan.color}12`,
                      }}
                    >
                      {gan.symbol}
                    </span>
                  )}
                </div>

                <Separator />

                <div
                  className="flex flex-col items-center py-2.5 px-2 gap-1"
                  style={{ background: ji?.bg ?? "rgba(0,0,0,0.02)" }}
                >
                  <span className="text-2xl font-bold leading-none" style={{ color: headCol }}>
                    {p.pillar.jiji.hanja}
                  </span>
                  <span
                    className="text-xs font-medium text-center leading-tight"
                    style={{ color: bodyCol }}
                  >
                    {p.pillar.jiji.name}
                  </span>
                  {ji && (
                    <span
                      className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md border"
                      style={{
                        color: ji.color,
                        borderColor: `${ji.color}50`,
                        background: `${ji.color}12`,
                      }}
                    >
                      {ji.symbol}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* ── Five Elements ── */}
      <div className="flex flex-col gap-2 py-3 sm:py-4">
        <p className="label" style={{ color: labelCol }}>
          {t("fiveElements")}
        </p>
        <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-5">
          {(["mok", "hwa", "to", "geum", "su"] as const).map((el, i) => {
            const e = OHENG[el];
            const count = oheng.balance[el];
            const pct = Math.round((count / ohengTotal) * 100);
            const isDominant = oheng.strongest === el && !oheng.missing.includes(el);
            return (
              <motion.div
                key={el}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.4 + i * 0.06, ease: EASE_OUT }}
                className="flex flex-col items-center gap-2 shrink-0"
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl font-bold text-xl sm:text-2xl transition-all duration-300",
                    isDominant && "relative overflow-visible",
                  )}
                  style={{
                    color: e.color,
                    background: isDominant
                      ? `linear-gradient(135deg, ${e.color}22 0%, ${e.color}08 50%, ${e.color}18 100%)`
                      : e.bg,
                    boxShadow: isDominant
                      ? `0 0 0 1px ${e.color}40, 0 2px 12px ${e.color}35, inset 0 1px 0 rgba(255,255,255,0.4)`
                      : undefined,
                  }}
                >
                  {e.symbol}
                </div>
                <div
                  className="w-11 sm:w-12 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(0,0,0,0.08)" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 0.45 + i * 0.06, ease: EASE_OUT }}
                    className="h-full rounded-full"
                    style={{ background: e.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* ── Key Influences ── */}
      <div className="flex flex-col gap-2 py-3 sm:py-4">
        <p className="label" style={{ color: labelCol }}>
          {t("keyInfluences")}
        </p>
        {strongInfluences.length === 0 ? (
          <p className="text-sm" style={{ color: bodyCol }}>
            {t("noInfluences")}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {strongInfluences.map((inf, i) => {
              const isAuspicious = inf.sinsal.type === "gilsin";
              const dot = isAuspicious ? "#2D5A43" : "#A63232";
              return (
                <motion.div
                  key={`${inf.sinsal.name}-${i}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.4 + i * 0.1, ease: EASE_OUT }}
                  className="flex items-start gap-2"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
                  <div className="min-w-0 flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: bodyCol }}>
                        {inf.sinsal.name}
                      </span>
                      <span className="text-xs font-mono" style={{ color: bodyCol }}>
                        {inf.sinsal.hanja}
                      </span>
                      <span
                        className="text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded-full"
                        style={{ background: `${dot}18`, color: dot }}
                      >
                        {isAuspicious ? t("auspicious") : t("challenging")}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: bodyCol }}>
                      {inf.interpretation}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
