"use client";

import { gsap } from "gsap";
import html2canvas from "html2canvas-pro";
import { ArrowLeft, Download, Home } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { InterpretedAnalysis } from "@/lib/saju/types/analysis";
import { FortuneCard } from "./FortuneCard";
import { FortuneInput } from "./FortuneInput";
import { FortuneLanguageToggle } from "./FortuneLanguageToggle";
import { FortuneLunarToggle } from "./FortuneLunarToggle";
import { FortuneReveal } from "./FortuneReveal";
import { BRAND, NAV, PAGE_BG, SKY_DAY, SKY_NIGHT } from "./fortune-colors";
import { getCardSkyTheme, KnobDatePicker, type KnobDateValue, to12Hour } from "./KnobDatePicker";
import { SvgCloud, SvgStar } from "./sky-shapes";

const STAR_POSITIONS: [number, number][] = [
  [0.1, 0.07],
  [0.22, 0.15],
  [0.35, 0.05],
  [0.48, 0.11],
  [0.6, 0.04],
  [0.72, 0.14],
  [0.85, 0.07],
  [0.15, 0.22],
  [0.3, 0.28],
  [0.55, 0.2],
  [0.78, 0.25],
  [0.92, 0.18],
  [0.42, 0.32],
  [0.65, 0.35],
  [0.05, 0.3],
];

const CLOUD_POSITIONS = [
  { fx: 0.18, fy: 0.15, scale: 56, opacity: 0.3 },
  { fx: 0.52, fy: 0.11, scale: 44, opacity: 0.22 },
  { fx: 0.8, fy: 0.14, scale: 40, opacity: 0.18 },
];

const PAGE_TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

interface FormData {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  isLunar: boolean;
}

/** Celestial position for SkyHeader — same arc logic as knob, different coordinate system */
function calcCelestialPosHeader(
  h: number,
  cx: number,
  arcW: number,
  arcH: number,
  skyMid: number,
  isDay: boolean,
) {
  if (isDay) {
    const t = (h - 6) / 12;
    const angle = Math.PI - t * Math.PI;
    return { x: cx + Math.cos(angle) * arcW, y: skyMid - Math.sin(angle) * arcH };
  }
  const t = h >= 18 ? (h - 18) / 12 : (h + 6) / 12;
  const angle = t * Math.PI;
  return { x: cx + Math.cos(angle) * arcW, y: skyMid + Math.sin(angle) * arcH * 0.6 };
}

/* ── Sky background SVG — covers full card, fades into card bg ── */
function SkyHeader({ hour }: { hour: number }) {
  const displayHourRef = useRef({ h: hour });
  const [displayHour, setDisplayHour] = useState(hour);
  const sky = getCardSkyTheme(hour);
  const W = 400;
  const H = 320; // taller viewBox so the fade reaches well into the form area
  const cx = W / 2;

  // Celestial body lives in the top 50% of the viewBox (visible sky region)
  const arcW = W * 0.36;
  const arcH = H * 0.2;
  const skyMid = H * 0.28; // vertical centre of the visible sky band
  const cel = calcCelestialPosHeader(displayHour, cx, arcW, arcH, skyMid, sky.isDay);

  const cr = 12; // celestial body radius (sun disc / moon)

  // Celestial — smoothly interpolates toward hour; continues motion when hour changes mid-flight (e.g. demo)
  useLayoutEffect(() => {
    gsap.to(displayHourRef.current, {
      h: hour,
      duration: 0.6,
      ease: "sine.inOut",
      overwrite: true,
      onUpdate: () => setDisplayHour(displayHourRef.current.h),
    });
  }, [hour]);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      role="img"
      aria-label="Sky gradient header"
    >
      <defs>
        <linearGradient id="hdr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky.top} />
          <stop offset="30%" stopColor={sky.bot} />
          <stop offset="65%" stopColor={sky.base} />
          <stop offset="100%" stopColor={sky.base} />
        </linearGradient>
        <radialGradient id="hdr-glow" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor={sky.isDay ? SKY_DAY.glow : SKY_NIGHT.glow}
            stopOpacity="0.45"
          />
          <stop
            offset="100%"
            stopColor={sky.isDay ? SKY_DAY.glow : SKY_NIGHT.glow}
            stopOpacity="0"
          />
        </radialGradient>
        <filter id="cel-glow-hdr" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="moon-clip-hdr">
          <circle cx={cr * 0.35} cy={-cr * 0.08} r={cr * 0.9} />
        </clipPath>
      </defs>

      {/* Sky fill — gradient already fades to card bg at bottom */}
      <rect width={W} height={H} fill="url(#hdr-sky)" />

      {/* Clouds (day) or stars (night) — confined to top half */}
      {sky.isDay ? (
        <g>
          {CLOUD_POSITIONS.map((c, i) => (
            <SvgCloud key={i} cx={W * c.fx} cy={H * c.fy} scale={c.scale} opacity={c.opacity} />
          ))}
        </g>
      ) : (
        <g>
          {STAR_POSITIONS.map(([fx, fy], i) => (
            <SvgStar
              key={i}
              cx={fx * W}
              cy={fy * H}
              r={i % 3 === 0 ? 4 : 2.5}
              opacity={0.25 + (i % 4) * 0.1}
            />
          ))}
        </g>
      )}

      {/* Celestial body + halo — interpolates toward hour same as knob */}
      <g transform={`translate(${cel.x} ${cel.y})`}>
        <circle cx={0} cy={0} r={cr * 2.2} fill="url(#hdr-glow)" />
        <g filter="url(#cel-glow-hdr)">
          {sky.isDay ? (
            <>
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * 2 * Math.PI;
                const tipR = cr * 1.28;
                const baseR = cr * 0.72;
                const spread = 0.045;
                const round = (n: number) => Math.round(n * 1000) / 1000;
                const xTip = round(Math.cos(a) * tipR);
                const yTip = round(Math.sin(a) * tipR);
                const xL = round(Math.cos(a - spread) * baseR);
                const yL = round(Math.sin(a - spread) * baseR);
                const xR = round(Math.cos(a + spread) * baseR);
                const yR = round(Math.sin(a + spread) * baseR);
                return (
                  <path
                    key={i}
                    d={`M ${xL} ${yL} L ${xTip} ${yTip} L ${xR} ${yR} Z`}
                    fill={SKY_DAY.sunRays}
                    opacity="0.9"
                  />
                );
              })}
              <circle r={cr * 0.75} fill={SKY_DAY.sunDisc} />
              <circle cx={-cr * 0.22} cy={-cr * 0.22} r={cr * 0.22} fill="white" opacity="0.40" />
            </>
          ) : (
            <>
              <circle r={cr} fill={SKY_NIGHT.moon} clipPath="url(#moon-clip-hdr)" />
              <circle
                cx={cr * 0.1}
                cy={cr * 0.28}
                r={cr * 0.13}
                fill={SKY_NIGHT.moonShade}
                opacity="0.45"
                clipPath="url(#moon-clip-hdr)"
              />
              <circle
                cx={-cr * 0.18}
                cy={cr * 0.05}
                r={cr * 0.09}
                fill={SKY_NIGHT.moonShade}
                opacity="0.35"
                clipPath="url(#moon-clip-hdr)"
              />
              <circle
                cx={-cr * 0.26}
                cy={-cr * 0.28}
                r={cr * 0.2}
                fill="white"
                opacity="0.28"
                clipPath="url(#moon-clip-hdr)"
              />
            </>
          )}
        </g>
      </g>
    </svg>
  );
}

export function FortunePage() {
  const t = useTranslations("Fortune");
  const [analysis, setAnalysis] = useState<InterpretedAnalysis | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [isLunar, setIsLunar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [wheel, setWheel] = useState<KnobDateValue>({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
  });
  const [homeHovered, setHomeHovered] = useState(false);
  const [resultHomeHovered, setResultHomeHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardDownloadRef = useRef<HTMLDivElement>(null);

  const sky = getCardSkyTheme(wheel.hour);
  const resultSky = analysis && formData ? getCardSkyTheme(formData.hour) : sky;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError(t("nameRequired"));
      return;
    }
    setNameError("");
    setError(null);
    setAnalysis(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/saju/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: wheel.year,
          month: wheel.month,
          day: wheel.day,
          hour: wheel.hour,
          isLunar,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? t("failedToGenerate"));
      }

      const json = await res.json();
      setFormData({ name: name.trim(), ...wheel, isLunar });
      setAnalysis(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("somethingWentWrong"));
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setAnalysis(null);
    setFormData(null);
    setError(null);
  }

  async function handleDownloadCard() {
    const el = cardDownloadRef.current;
    if (!el || isDownloading) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(el, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        ignoreElements: (node) => node.getAttribute?.("data-html2canvas-ignore") === "true",
      });
      const link = document.createElement("a");
      link.download = `saju-${formData?.name ?? "fortune"}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setIsDownloading(false);
    }
  }

  const months = t.raw("months") as string[];
  const birthDateStr = formData
    ? (() => {
        const { hour12, ampm } = to12Hour(formData.hour);
        return `${months[formData.month - 1]} ${formData.day}, ${formData.year} · ${hour12}:00 ${ampm}${formData.isLunar ? ` (${t("lunar")})` : ""}`;
      })()
    : "";

  return (
    <div className="min-h-dvh w-full pb-[env(safe-area-inset-bottom)] relative overflow-hidden">
      {/* Page background — brand color tints */}
      <div
        className="absolute inset-0 pointer-events-none bg-background"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% 0%, ${PAGE_BG.red} 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 100%, ${PAGE_BG.green} 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 0% 80%, ${PAGE_BG.gold} 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto max-w-lg px-4 pt-8 pb-12 sm:pt-12 sm:pb-16 flex flex-col items-center min-h-dvh">
        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={PAGE_TRANSITION}
              className="w-full max-w-md"
            >
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/60"
                style={{ backgroundColor: sky.base }}
              >
                {/* ── Sky — absolute behind entire card, fades into base ── */}
                <SkyHeader hour={wheel.hour} />

                {/* ── Nav bar ── */}
                <div className="relative z-10 flex items-center justify-between gap-3 px-5 pt-3 sm:px-7 sm:pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="rounded-xl backdrop-blur-sm gap-2 px-4 py-2 transition-colors duration-200"
                    style={{
                      color: sky.isDay ? NAV.day.color : NAV.night.color,
                      background: homeHovered
                        ? sky.isDay
                          ? NAV.day.hoverBg
                          : NAV.night.hoverBg
                        : sky.isDay
                          ? NAV.day.bg
                          : NAV.night.bg,
                      border: `1px solid ${sky.isDay ? NAV.day.border : NAV.night.border}`,
                    }}
                    onMouseEnter={() => setHomeHovered(true)}
                    onMouseLeave={() => setHomeHovered(false)}
                  >
                    <Link href="/">
                      <Home className="size-4" />
                      {t("home")}
                    </Link>
                  </Button>
                  <FortuneLanguageToggle isDay={sky.isDay} />
                </div>

                {/* ── Form body ── */}
                <div className="relative z-10 px-5 pt-3 pb-5 space-y-4 sm:px-7 sm:pt-4 sm:pb-6">
                  {/* Name input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex-1 h-px bg-border/50" />
                      <span className="font-mono text-sm font-medium text-foreground/80 tracking-widest">
                        {t("yourName")}
                      </span>
                      <div className="flex-1 h-px bg-border/50" />
                    </div>
                    <FortuneInput
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError("");
                      }}
                      placeholder={t("enterName")}
                      autoComplete="off"
                    />
                    {nameError && (
                      <p className="text-xs text-destructive font-medium">{nameError}</p>
                    )}
                  </div>

                  {/* Date & time picker */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex-1 h-px bg-border/50" />
                      <span className="font-mono text-sm font-medium text-foreground/80 tracking-widest">
                        {t("birthDate")}
                      </span>
                      <div className="flex-1 h-px bg-border/50" />
                    </div>
                    <KnobDatePicker value={wheel} onChange={setWheel} />
                  </div>

                  {/* Lunar toggle */}
                  <FortuneLunarToggle checked={isLunar} onCheckedChange={setIsLunar} />

                  {error && (
                    <div className="px-4 py-3 rounded-xl bg-destructive/10 text-sm text-destructive font-medium border border-destructive/20">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <motion.div
                    whileHover={!isLoading ? { scale: 1.02 } : undefined}
                    whileTap={!isLoading ? { scale: 0.98 } : undefined}
                  >
                    <Button
                      type="submit"
                      size="xl"
                      disabled={isLoading}
                      className={`w-full rounded-xl text-base font-semibold text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${!isLoading ? "cta-reveal" : ""}`}
                      style={{
                        background: `linear-gradient(to right, ${BRAND.red}, ${BRAND.gold}, ${BRAND.green})`,
                      }}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          {t("reading")}
                        </span>
                      ) : (
                        t("revealSaju")
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={PAGE_TRANSITION}
              className="w-full max-w-md"
            >
              <FortuneReveal>
                <div
                  ref={cardDownloadRef}
                  className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/60"
                  style={{ backgroundColor: resultSky.base }}
                >
                  <SkyHeader hour={formData?.hour ?? 12} />
                  <div
                    className="relative z-10 flex items-center justify-between gap-3 px-5 pt-3 sm:px-7 sm:pt-4"
                    data-html2canvas-ignore="true"
                    role="group"
                    aria-label="Result card actions"
                    onMouseEnter={() => setResultHomeHovered(true)}
                    onMouseLeave={() => setResultHomeHovered(false)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={handleReset}
                      className="rounded-xl backdrop-blur-sm gap-2 px-4 py-2 transition-colors duration-200"
                      style={{
                        color: resultSky.isDay ? NAV.day.color : NAV.night.color,
                        background: resultHomeHovered
                          ? resultSky.isDay
                            ? NAV.day.hoverBg
                            : NAV.night.hoverBg
                          : resultSky.isDay
                            ? NAV.day.bg
                            : NAV.night.bg,
                        border: `1px solid ${resultSky.isDay ? NAV.day.border : NAV.night.border}`,
                      }}
                    >
                      <ArrowLeft className="size-4" />
                      {t("back")}
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={handleDownloadCard}
                        disabled={isDownloading}
                        className="rounded-xl backdrop-blur-sm gap-2 px-4 py-2 transition-colors duration-200"
                        style={{
                          color: resultSky.isDay ? NAV.day.color : NAV.night.color,
                          background: resultHomeHovered
                            ? resultSky.isDay
                              ? NAV.day.hoverBg
                              : NAV.night.hoverBg
                            : resultSky.isDay
                              ? NAV.day.bg
                              : NAV.night.bg,
                          border: `1px solid ${resultSky.isDay ? NAV.day.border : NAV.night.border}`,
                        }}
                      >
                        {isDownloading ? (
                          <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download className="size-4" />
                        )}
                        {t("download")}
                      </Button>
                      <FortuneLanguageToggle isDay={resultSky.isDay} />
                    </div>
                  </div>
                  <div className="relative z-10 px-5 pt-3 pb-5 sm:px-7 sm:pt-4 sm:pb-6">
                    <FortuneCard
                      name={formData?.name ?? ""}
                      birthDate={birthDateStr}
                      analysis={analysis}
                      hour={formData?.hour ?? 12}
                    />
                  </div>
                </div>
              </FortuneReveal>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
