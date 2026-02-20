"use client";

import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import type { MutableRefObject } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CARD, KNOB_ACCENT, KNOB_DAY, SKY_DAY, SKY_NIGHT } from "./fortune-colors";
import { SvgCloud, SvgStar } from "./sky-shapes";

/* ─── constants ───────────────────────────────────────────── */
const CURRENT_YEAR = new Date().getFullYear();

/* ─── colour helpers ──────────────────────────────────────── */
function lerpColor(a: string, b: string, t: number): string {
  const p = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  const ch = (n: number) => n.toString(16).padStart(2, "0");
  return `#${ch(Math.round(ar + (br - ar) * t))}${ch(Math.round(ag + (bg - ag) * t))}${ch(Math.round(ab + (bb - ab) * t))}`;
}

export function hourTheme(hour: number) {
  const MIDNIGHT = SKY_NIGHT.midnight;
  const DAWN = "#3A4558";
  const MORNING = "#6B5A40";
  const GOLD = "#C89038";
  const MIDDAY = "#D09830";
  const DUSK = "#3A2028";

  /* Day skyBot: light gold horizon (morning) → pale cream (midday) → warm gold (afternoon).
     Dawn/dusk: horizon transition. Night: deep blue. */
  const stops = [
    { h: 0, sky: MIDNIGHT, skyBot: "#1E2548", glow: "#2A3568" },
    { h: 5, sky: MIDNIGHT, skyBot: "#1E2548", glow: "#2A3568" },
    { h: 6, sky: DAWN, skyBot: "#3A4A58", glow: "#4A5880" },
    { h: 7, sky: MORNING, skyBot: "#E8D090", glow: "#9A7040" },
    { h: 11, sky: GOLD, skyBot: "#E0C890", glow: "#E0A040" },
    { h: 13, sky: MIDDAY, skyBot: "#E8D8B0", glow: "#E8A838" },
    { h: 17, sky: GOLD, skyBot: "#D8B878", glow: "#C08830" },
    { h: 18, sky: DUSK, skyBot: "#5A4030", glow: "#583020" },
    { h: 19, sky: MIDNIGHT, skyBot: "#1E2548", glow: "#2A3568" },
    { h: 23, sky: MIDNIGHT, skyBot: "#1E2548", glow: "#2A3568" },
  ];

  let lo = stops[0],
    hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (hour >= stops[i].h && hour < stops[i + 1].h) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const t = lo.h === hi.h ? 0 : (hour - lo.h) / (hi.h - lo.h);
  const day = hour >= 6 && hour < 18;
  return {
    skyTop: lerpColor(lo.sky, hi.sky, t),
    skyBot: lerpColor(lo.skyBot, hi.skyBot, t),
    glowColor: lerpColor(lo.glow, hi.glow, t),
    trackColor: day ? "#E8A820" : "#6868D8",
    // High-contrast: near-black on bright day, pure white on dark night
    textColor: day ? "#0A0704" : "#FFFFFF",
    textShadow: (() => {
      const morning = hour >= 6 && hour < 12;
      if (day) {
        // Outline to pop + light shine for morning
        const outline =
          "0 1px 2px rgba(255,255,255,0.9), 0 -1px 2px rgba(255,255,255,0.8), 1px 0 2px rgba(255,255,255,0.8), -1px 0 2px rgba(255,255,255,0.8), 0 2px 6px rgba(0,0,0,0.4)";
        const shine = morning
          ? ", -2px -2px 6px rgba(255,248,200,0.6), -1px -1px 3px rgba(255,250,220,0.8)"
          : ", 0 1px 3px rgba(255,252,240,0.5)";
        return outline + shine;
      }
      return "0 0 2px rgba(8,8,24,0.95), 0 0 14px rgba(120,120,220,0.5), 0 2px 4px rgba(0,0,0,0.6), 0 1px 2px rgba(255,255,255,0.3), -1px -1px 2px rgba(255,255,255,0.2), 1px 1px 2px rgba(255,255,255,0.2)";
    })(),
    isDay: day,
  };
}

/* ─── digit flip animation ────────────────────────────────── */
const DIGIT_DIST = 28; // Travel distance — larger for clearer, non-overlapping motion
const DIGIT_DUR = 0.24; // Exit duration
const ENTER_DUR = 0.28; // Enter duration

function animateDigit(el: HTMLSpanElement, dir: 1 | -1, dur = ENTER_DUR, dist = DIGIT_DIST) {
  gsap.killTweensOf(el);
  gsap.fromTo(
    el,
    { y: dir * dist, opacity: 0 },
    { y: 0, opacity: 1, duration: dur, ease: "sine.inOut", overwrite: true },
  );
}

/** Cancel any in-flight animation; reset chars to visible */
function cancelNumberAnimation(
  ghostRef: MutableRefObject<HTMLElement | null>,
  charRefs: (HTMLSpanElement | null)[],
) {
  const ghost = ghostRef.current;
  if (ghost) {
    gsap.killTweensOf(ghost);
    ghost.remove();
    ghostRef.current = null;
  }
  charRefs.forEach((el) => {
    if (el) {
      gsap.killTweensOf(el);
      gsap.set(el, { y: 0, opacity: 1 });
    }
  });
}

/** Animate OLD number exiting, then NEW number entering. Kills previous animation first. */
function animateNumberReplace(
  oldDisplay: string,
  _newDisplay: string,
  containerEl: HTMLElement,
  newCharRefs: (HTMLSpanElement | null)[],
  dir: 1 | -1,
  styles: {
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    color: string;
    lineHeight: string;
    textShadow: string;
  },
  ghostRef: MutableRefObject<HTMLElement | null>,
) {
  cancelNumberAnimation(ghostRef, newCharRefs);

  const rect = containerEl.getBoundingClientRect();
  const ghost = document.createElement("span");
  ghost.style.cssText = `
    position: fixed; left: ${rect.left}px; top: ${rect.top}px; min-height: ${rect.height}px;
    display: flex; align-items: center;
    font-size: ${styles.fontSize}; font-family: ${styles.fontFamily}; font-weight: ${styles.fontWeight};
    color: ${styles.color}; line-height: ${styles.lineHeight}; text-shadow: ${styles.textShadow};
    letter-spacing: 0.06em; margin: 0; pointer-events: none; z-index: 9999;
  `;
  ghost.textContent = oldDisplay;
  document.body.appendChild(ghost);
  ghostRef.current = ghost;

  for (const el of newCharRefs) {
    if (el) gsap.set(el, { y: dir * DIGIT_DIST, opacity: 0 });
  }

  gsap.fromTo(
    ghost,
    { y: 0, opacity: 1 },
    {
      y: dir * -DIGIT_DIST,
      opacity: 0,
      duration: DIGIT_DUR,
      ease: "sine.in",
      overwrite: true,
      onComplete: () => {
        ghost.remove();
        ghostRef.current = null;
        for (const el of newCharRefs) {
          if (el) animateDigit(el, dir);
        }
      },
    },
  );
}

/* ─── KnobDial (date dials only) ─────────────────────────── */
interface KnobDialProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
  display: string;
  size: number;
  color: string;
}

function KnobDial({ value, min, max, onChange, label, display, size, color }: KnobDialProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const digitContainerRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ghostRef = useRef<HTMLElement | null>(null);
  const prevDisplay = useRef(display);
  const prevValue = useRef(value);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, startValue: 0, prevAngle: 0, totalDelta: 0 });

  const half = size / 2;
  const outerR = half - 3;
  const trackR = outerR - 6;
  const totalValues = max - min + 1;
  const norm = (value - min) / totalValues;
  const dotRad = norm * 2 * Math.PI - Math.PI / 2;
  const dotX = half + Math.cos(dotRad) * trackR;
  const dotY = half + Math.sin(dotRad) * trackR;
  const circ = 2 * Math.PI * trackR;
  const dashOffset = circ * (1 - norm);

  // Replace animation: OLD exits, NEW enters. Cancel previous on rapid change.
  useLayoutEffect(() => {
    const prev = prevDisplay.current;
    const dir: 1 | -1 = value > prevValue.current ? 1 : -1;
    prevDisplay.current = display;
    prevValue.current = value;

    const container = digitContainerRef.current;
    const firstChar = charRefs.current[0];

    if (prev === display) {
      cancelNumberAnimation(ghostRef, charRefs.current);
      return;
    }

    if (!container || !firstChar) return;

    const cs = window.getComputedStyle(firstChar);
    animateNumberReplace(
      prev,
      display,
      container,
      charRefs.current,
      dir,
      {
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight,
        color: cs.color,
        lineHeight: cs.lineHeight,
        textShadow: cs.textShadow,
      },
      ghostRef,
    );
  }, [display, value]);

  useLayoutEffect(() => () => cancelNumberAnimation(ghostRef, charRefs.current), []);

  // Arc progress — fromTo for reliable strokeDashoffset
  const prevDashRef = useRef(dashOffset);
  useLayoutEffect(() => {
    const el = arcRef.current;
    if (!el || norm <= 0.005) return;
    const from = prevDashRef.current;
    prevDashRef.current = dashOffset;
    gsap.fromTo(
      el,
      { strokeDashoffset: from },
      { strokeDashoffset: dashOffset, duration: 0.35, ease: "power2.out", overwrite: true },
    );
  }, [dashOffset, norm]);

  const getAngle = (e: React.PointerEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    return (((Math.atan2(dy, dx) * (180 / Math.PI) + 90) % 360) + 360) % 360;
  };

  const emit = (next: number) => {
    if (next !== value) onChange(next);
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    drag.current = { active: true, startValue: value, prevAngle: getAngle(e), totalDelta: 0 };
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const a = getAngle(e);
    let delta = a - drag.current.prevAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    drag.current.totalDelta += delta;
    drag.current.prevAngle = a;
    emit(
      Math.max(
        min,
        Math.min(
          max,
          Math.round(drag.current.startValue + (drag.current.totalDelta / 360) * totalValues),
        ),
      ),
    );
  };
  const onUp = () => {
    drag.current.active = false;
    setDragging(false);
  };
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    emit(Math.max(min, Math.min(max, value + (e.deltaY > 0 ? 1 : -1))));
  };

  const fsDial = size * (display.length > 3 ? 0.165 : 0.215);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={wrapRef}
        style={{
          position: "relative",
          width: size,
          height: size,
          touchAction: "none",
          userSelect: "none",
          cursor: dragging ? "grabbing" : "grab",
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onWheel={onWheel}
        tabIndex={0}
        role="spinbutton"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            emit(Math.min(max, value + 1));
          }
          if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            emit(Math.max(min, value - 1));
          }
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          aria-hidden
          role="img"
          aria-label={`${label} dial`}
        >
          <defs>
            <filter id={`ds-${label}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={color} floodOpacity="0.14" />
            </filter>
          </defs>
          <circle cx={half} cy={half} r={outerR} fill="var(--card)" filter={`url(#ds-${label})`} />
          <circle
            cx={half}
            cy={half}
            r={outerR}
            fill="none"
            stroke={dragging ? color : "var(--border)"}
            strokeWidth="1.5"
            style={{ transition: "stroke 0.2s" }}
          />
          <circle
            cx={half}
            cy={half}
            r={trackR}
            fill="none"
            stroke={`${color}22`}
            strokeWidth="3"
          />
          {norm > 0.005 && (
            <circle
              ref={arcRef}
              cx={half}
              cy={half}
              r={trackR}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${half} ${half})`}
            />
          )}
          {/* Orbit dot */}
          <circle cx={dotX} cy={dotY} r={5.5} fill={color} opacity="0.20" />
          <circle cx={dotX} cy={dotY} r={3.5} fill={color} />
          <circle cx={dotX - 0.7} cy={dotY - 0.9} r={1.2} fill="white" opacity="0.7" />
        </svg>

        {/* Digit display — padding prevents clipping; overflow hidden for flip animation */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: `${DIGIT_DIST}px 6px`,
              minHeight: `calc(${fsDial}px * 1.2 + ${DIGIT_DIST * 2}px)`,
            }}
          >
            <span
              ref={digitContainerRef}
              className="font-mono font-bold"
              style={{
                fontSize: fsDial,
                lineHeight: 1.15,
                color: "var(--foreground)",
                display: "flex",
              }}
            >
              {display.split("").map((ch, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    charRefs.current[i] = el;
                  }}
                  style={{ display: "inline-block" }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
      <span
        className="font-mono uppercase tracking-widest"
        style={{ fontSize: "0.57rem", color: `${color}bb` }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── HourKnob ────────────────────────────────────────────── */
interface HourKnobProps {
  value: number;
  onChange: (v: number) => void;
  size: number;
}

/** Card sky theme — top from sky, base = lighter variant of top (near white) */
export function getCardSkyTheme(hour: number) {
  const ht = hourTheme(hour);
  const top = lerpColor(ht.skyTop, CARD.bg, ht.isDay ? 0.78 : 0.55);
  const bot = lerpColor(ht.skyBot, CARD.bg, 0.88);
  const glow = lerpColor(ht.glowColor, CARD.bg, 0.8);
  const base = lerpColor(top, "#FFFFFF", 0.93); // same hue as top, lighter, close to white
  return {
    top,
    bot,
    glow,
    base,
    gradient: `linear-gradient(160deg, ${top} 0%, ${bot} 100%)`,
    isDay: ht.isDay,
  };
}

const KNOB_MIDNIGHT_DARK = "#0A0E20";

function knobSkyColors(hour: number) {
  const ht = hourTheme(hour);
  if (ht.isDay) {
    return {
      top: KNOB_DAY.top,
      bot: KNOB_DAY.bot,
    };
  }
  return {
    top: SKY_NIGHT.midnight,
    bot: lerpColor(SKY_NIGHT.midnight, KNOB_MIDNIGHT_DARK, 0.7),
  };
}

export function to12Hour(hour24: number): { hour12: number; ampm: "AM" | "PM" } {
  const ampm = hour24 < 12 ? "AM" : "PM";
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  return { hour12, ampm };
}

function calcCelestialPos(h: number, half: number, arcR: number, isDay: boolean) {
  if (isDay) {
    const t = (h - 6) / 12;
    const angle = Math.PI - t * Math.PI;
    return {
      x: half + Math.cos(angle) * arcR,
      y: half - Math.sin(angle) * arcR,
    };
  }
  const t = h >= 18 ? (h - 18) / 12 : (h + 6) / 12;
  const angle = t * Math.PI;
  return {
    x: half + Math.cos(angle) * arcR,
    y: half + Math.sin(angle) * arcR,
  };
}

function HourKnob({ value, onChange, size }: HourKnobProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const celestialRef = useRef<SVGGElement>(null);
  const digitContainerRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ghostRef = useRef<HTMLElement | null>(null);
  const displayHourRef = useRef({ h: value });
  const [displayHour, setDisplayHour] = useState(value);
  const { hour12, ampm } = to12Hour(value);
  const numberDisplay = String(hour12);
  const prevDisplay = useRef(numberDisplay);
  const prevValue = useRef(value);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, startValue: 0, prevAngle: 0, totalDelta: 0 });
  const half = size / 2;
  const outerR = half - 3;
  const trackR = outerR - 6;
  const arcR = outerR * 0.48;
  const totalValues = 24;
  const norm = value / totalValues;
  const dotRad = norm * 2 * Math.PI - Math.PI / 2;
  const dotX = half + Math.cos(dotRad) * trackR;
  const dotY = half + Math.sin(dotRad) * trackR;
  const circ = 2 * Math.PI * trackR;
  const dashOffset = circ * (1 - norm);
  const ht = hourTheme(value);
  const ks = knobSkyColors(value);
  const fs = size * 0.2;

  // Celestial position driven by displayHour; GSAP tweens displayHour toward value in effect
  const celestialPos = calcCelestialPos(displayHour, half, arcR, ht.isDay);

  // Replace animation: OLD exits, NEW enters. Cancel previous on rapid change.
  useLayoutEffect(() => {
    const prev = prevDisplay.current;
    const dir: 1 | -1 = value > prevValue.current ? 1 : -1;
    prevDisplay.current = numberDisplay;
    prevValue.current = value;

    const container = digitContainerRef.current;
    const firstChar = charRefs.current[0];

    if (prev === numberDisplay) {
      cancelNumberAnimation(ghostRef, charRefs.current);
      return;
    }

    if (!container || !firstChar) return;

    const cs = window.getComputedStyle(firstChar);
    animateNumberReplace(
      prev,
      numberDisplay,
      container,
      charRefs.current,
      dir,
      {
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight,
        color: cs.color,
        lineHeight: cs.lineHeight,
        textShadow: cs.textShadow,
      },
      ghostRef,
    );
  }, [numberDisplay, value]);

  useLayoutEffect(() => () => cancelNumberAnimation(ghostRef, charRefs.current), []);

  // Arc — fromTo for reliable strokeDashoffset
  const prevDashRef = useRef(dashOffset);
  useLayoutEffect(() => {
    const el = arcRef.current;
    if (!el) return;
    const from = prevDashRef.current;
    prevDashRef.current = dashOffset;
    gsap.fromTo(
      el,
      { strokeDashoffset: from },
      { strokeDashoffset: dashOffset, duration: 0.5, ease: "sine.inOut", overwrite: true },
    );
  }, [dashOffset]);

  // Celestial — smoothly interpolates toward value; continues motion when value changes mid-flight
  useLayoutEffect(() => {
    gsap.to(displayHourRef.current, {
      h: value,
      duration: 0.6,
      ease: "sine.inOut",
      overwrite: true,
      onUpdate: () => setDisplayHour(displayHourRef.current.h),
    });
  }, [value]);

  const getAngle = (e: React.PointerEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    return (((Math.atan2(dy, dx) * (180 / Math.PI) + 90) % 360) + 360) % 360;
  };

  const emit = (next: number) => {
    if (next !== value) onChange(next);
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    drag.current = { active: true, startValue: value, prevAngle: getAngle(e), totalDelta: 0 };
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const a = getAngle(e);
    let delta = a - drag.current.prevAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    drag.current.totalDelta += delta;
    drag.current.prevAngle = a;
    emit(
      Math.max(
        0,
        Math.min(
          23,
          Math.round(drag.current.startValue + (drag.current.totalDelta / 360) * totalValues),
        ),
      ),
    );
  };
  const onUp = () => {
    drag.current.active = false;
    setDragging(false);
  };
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    emit(Math.max(0, Math.min(23, value + (e.deltaY > 0 ? 1 : -1))));
  };

  const cr = Math.round(outerR * 0.16 * 100) / 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={wrapRef}
        style={{
          position: "relative",
          width: size,
          height: size,
          touchAction: "none",
          userSelect: "none",
          cursor: dragging ? "grabbing" : "grab",
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onWheel={onWheel}
        tabIndex={0}
        role="spinbutton"
        aria-label="Hour"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={23}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            emit(Math.min(23, value + 1));
          }
          if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            emit(Math.max(0, value - 1));
          }
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          aria-hidden
          role="img"
          aria-label="Hour dial"
        >
          <defs>
            <filter id="ds-hour" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="8"
                floodColor={ht.glowColor}
                floodOpacity="0.55"
              />
            </filter>
            <filter id="cel-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="knob-face">
              <circle cx={half} cy={half} r={outerR - 0.5} />
            </clipPath>
            {/* Sky gradient — light at top, fades to near-white at bottom */}
            <linearGradient id="sky-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ks.top} />
              <stop offset="100%" stopColor={ks.bot} />
            </linearGradient>
            {/* Subtle glow halo at celestial position */}
            <radialGradient id="cel-halo" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor={ht.isDay ? SKY_DAY.glow : SKY_NIGHT.glow}
                stopOpacity="0.5"
              />
              <stop
                offset="100%"
                stopColor={ht.isDay ? SKY_DAY.glow : SKY_NIGHT.glow}
                stopOpacity="0"
              />
            </radialGradient>
            <clipPath id="moon-crescent">
              <circle
                cx={Math.round(cr * 0.35 * 100) / 100}
                cy={Math.round(-cr * 0.08 * 100) / 100}
                r={Math.round(cr * 0.9 * 100) / 100}
              />
            </clipPath>
          </defs>

          {/* Drop shadow base */}
          <circle cx={half} cy={half} r={outerR} fill="var(--card)" filter="url(#ds-hour)" />

          {/* Sky fill */}
          <circle
            cx={half}
            cy={half}
            r={outerR - 0.5}
            fill="url(#sky-bg)"
            clipPath="url(#knob-face)"
          />

          {/* Background stars (night) or clouds (day) */}
          <g clipPath="url(#knob-face)">
            {ht.isDay ? (
              <>
                <SvgCloud cx={half * 0.55} cy={half * 0.58} scale={outerR * 0.22} opacity={0.11} />
                <SvgCloud cx={half * 1.38} cy={half * 0.48} scale={outerR * 0.18} opacity={0.08} />
                <SvgCloud cx={half * 0.82} cy={half * 0.38} scale={outerR * 0.14} opacity={0.07} />
              </>
            ) : (
              (
                [
                  [0.2, 0.22],
                  [0.7, 0.17],
                  [0.54, 0.7],
                  [0.8, 0.55],
                  [0.15, 0.6],
                  [0.6, 0.35],
                  [0.36, 0.44],
                  [0.76, 0.75],
                  [0.28, 0.78],
                  [0.86, 0.32],
                  [0.46, 0.19],
                  [0.08, 0.36],
                ] as [number, number][]
              ).map(([fx, fy], i) => (
                <SvgStar
                  key={i}
                  cx={fx * size}
                  cy={fy * size}
                  r={i % 3 === 0 ? 2.5 : 1.8}
                  opacity={0.16 + (i % 4) * 0.07}
                />
              ))
            )}
          </g>

          {/* Horizon line */}
          <line
            x1={half - outerR * 0.72}
            y1={half}
            x2={half + outerR * 0.72}
            y2={half}
            stroke={ht.isDay ? SKY_DAY.horizon : SKY_NIGHT.horizon}
            strokeWidth="0.75"
            opacity="0.22"
            clipPath="url(#knob-face)"
          />

          {/* Celestial body + halo — GSAP animates this g (position + scale pulse) */}
          <g ref={celestialRef} transform={`translate(${celestialPos.x} ${celestialPos.y})`}>
            <circle cx={0} cy={0} r={cr * 2.2} fill="url(#cel-halo)" clipPath="url(#knob-face)" />
            <g filter="url(#cel-glow)">
              {ht.isDay ? (
                // Sun — disc + pointed elegant rays
                <>
                  {Array.from({ length: 12 }, (_, i) => {
                    const a = (i / 12) * 2 * Math.PI;
                    const tipR = cr * 1.25;
                    const baseR = cr * 0.7;
                    const spread = 0.04;
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
                  <circle r={Math.round(cr * 0.75 * 100) / 100} fill={SKY_DAY.sunDisc} />
                  {/* specular highlight */}
                  <circle
                    cx={Math.round(-cr * 0.22 * 100) / 100}
                    cy={Math.round(-cr * 0.22 * 100) / 100}
                    r={Math.round(cr * 0.22 * 100) / 100}
                    fill="white"
                    opacity="0.40"
                  />
                </>
              ) : (
                // Moon — crescent via clipPath
                <>
                  <circle r={cr} fill={SKY_NIGHT.moon} clipPath="url(#moon-crescent)" />
                  <circle
                    cx={Math.round(cr * 0.1 * 100) / 100}
                    cy={Math.round(cr * 0.28 * 100) / 100}
                    r={Math.round(cr * 0.13 * 100) / 100}
                    fill={SKY_NIGHT.moonShade}
                    opacity="0.45"
                    clipPath="url(#moon-crescent)"
                  />
                  <circle
                    cx={Math.round(-cr * 0.18 * 100) / 100}
                    cy={Math.round(cr * 0.05 * 100) / 100}
                    r={Math.round(cr * 0.09 * 100) / 100}
                    fill={SKY_NIGHT.moonShade}
                    opacity="0.35"
                    clipPath="url(#moon-crescent)"
                  />
                  {/* limb highlight */}
                  <circle
                    cx={Math.round(-cr * 0.26 * 100) / 100}
                    cy={Math.round(-cr * 0.28 * 100) / 100}
                    r={Math.round(cr * 0.2 * 100) / 100}
                    fill="white"
                    opacity="0.28"
                    clipPath="url(#moon-crescent)"
                  />
                </>
              )}
            </g>
          </g>

          {/* Outer rim */}
          <circle
            cx={half}
            cy={half}
            r={outerR}
            fill="none"
            stroke={dragging ? ht.trackColor : `${ht.trackColor}66`}
            strokeWidth="1.5"
            style={{ transition: "stroke 0.2s" }}
          />

          {/* Track arc background */}
          <circle
            cx={half}
            cy={half}
            r={trackR}
            fill="none"
            stroke={`${ht.trackColor}28`}
            strokeWidth="3.5"
          />

          {/* Progress arc — GSAP animates strokeDashoffset */}
          <circle
            ref={arcRef}
            cx={half}
            cy={half}
            r={trackR}
            fill="none"
            stroke={ht.trackColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${half} ${half})`}
          />

          {/* Orbit dot */}
          <circle cx={dotX} cy={dotY} r={6} fill={ht.trackColor} opacity="0.22" />
          <circle cx={dotX} cy={dotY} r={4} fill={ht.trackColor} />
          <circle cx={dotX - 0.8} cy={dotY - 1} r={1.3} fill="white" opacity="0.65" />
        </svg>

        {/* Hour number — padding prevents clipping; overflow hidden for flip animation */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: `${DIGIT_DIST}px 8px`,
              minHeight: `calc(${fs}px * 1.2 + ${DIGIT_DIST * 2}px)`,
            }}
          >
            <span
              className="font-mono font-bold"
              style={{
                fontSize: fs,
                lineHeight: 1.15,
                color: ht.textColor,
                transition: "color 0.4s ease",
                display: "flex",
                letterSpacing: "0.06em",
                textShadow: ht.textShadow,
              }}
            >
              <span ref={digitContainerRef} style={{ display: "flex" }}>
                {numberDisplay.split("").map((ch, i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      charRefs.current[i] = el;
                    }}
                    style={{ display: "inline-block", color: ht.textColor }}
                  >
                    {ch}
                  </span>
                ))}
              </span>
              <span style={{ marginLeft: "0.15em" }}> {ampm}</span>
            </span>
          </div>
        </div>
      </div>

      <span
        className="font-mono uppercase tracking-widest"
        style={{ fontSize: "0.57rem", color: `${ht.trackColor}bb` }}
      >
        Hour
      </span>
    </div>
  );
}

/* ─── KnobDatePicker ──────────────────────────────────────── */
export interface KnobDateValue {
  year: number;
  month: number;
  day: number;
  hour: number;
}

interface KnobDatePickerProps {
  value: KnobDateValue;
  onChange: (v: KnobDateValue) => void;
}

const DEMO_DELAY_MS = 600;
const DEMO_STEP_MS = 80;

export function KnobDatePicker({ value, onChange }: KnobDatePickerProps) {
  const t = useTranslations("Fortune");
  const { year, month, day, hour } = value;
  const isMobile = useIsMobile();
  const dateSize = isMobile ? 96 : 120;
  const hourSize = isMobile ? 140 : 170;
  const maxDays = new Date(year, month, 0).getDate();
  const months = t.raw("months") as string[];
  const demoDone = useRef(false);

  const set = (patch: Partial<KnobDateValue>) => {
    const next = { ...value, ...patch };
    const maxD = new Date(next.year, next.month, 0).getDate();
    if (next.day > maxD) next.day = maxD;
    onChange(next);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Demo intentionally runs once on mount
  useEffect(() => {
    if (demoDone.current) return;
    demoDone.current = true;
    const ids: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delay: number) => {
      ids.push(setTimeout(fn, delay));
    };
    const steps: number[] = [];
    for (let h = 13; h <= 23; h++) steps.push(h); // 12 noon → 11pm
    for (let h = 22; h >= 12; h--) steps.push(h); // back to noon
    steps.forEach((h, i) => {
      schedule(() => set({ hour: h }), DEMO_DELAY_MS + i * DEMO_STEP_MS);
    });
    return () => ids.forEach(clearTimeout);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ── Date row ── */}
      <div className="flex items-start justify-center gap-2 sm:gap-3 px-6 pt-4 pb-6">
        <KnobDial
          value={year}
          min={1900}
          max={CURRENT_YEAR}
          onChange={(v) => set({ year: v })}
          label={t("year")}
          display={String(year)}
          size={dateSize}
          color={KNOB_ACCENT.year}
        />
        <KnobDial
          value={month}
          min={1}
          max={12}
          onChange={(v) => set({ month: v })}
          label={t("month")}
          display={months[month - 1]}
          size={dateSize}
          color={KNOB_ACCENT.month}
        />
        <KnobDial
          value={day}
          min={1}
          max={maxDays}
          onChange={(v) => set({ day: v })}
          label={t("day")}
          display={String(day).padStart(2, "0")}
          size={dateSize}
          color={KNOB_ACCENT.day}
        />
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 px-6 py-1">
        <div className="flex-1 h-px bg-border/50" />
        <span className="font-mono text-sm font-medium text-foreground/80 tracking-widest">
          {t("time")}
        </span>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* ── Hour knob ── */}
      <div className="flex justify-center px-6 pt-2 pb-5">
        <HourKnob value={hour} onChange={(v) => set({ hour: v })} size={hourSize} />
      </div>
    </div>
  );
}
