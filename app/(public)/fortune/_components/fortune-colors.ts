/**
 * Centralized color palette for the fortune/Saju feature.
 * All colors used across FortunePage, KnobDatePicker, FortuneCard, SkyHeader.
 */

/** Brand palette — used in CTA, knobs, page accents */
export const BRAND = {
  red: "#A63232",
  gold: "#C5A059",
  green: "#2D5A43",
} as const;

/** Date picker knob accent colors */
export const KNOB_ACCENT = {
  year: BRAND.red,
  month: BRAND.green,
  day: "#4A8B82",
} as const;

/** Sky theme — day */
export const SKY_DAY = {
  glow: "#FFD060",
  sunRays: "#FFD840",
  sunDisc: "#FFE840",
  horizon: "#F8D080",
} as const;

/** Sky theme — night */
export const SKY_NIGHT = {
  midnight: "#1A2045",
  glow: "#8080FF",
  moon: "#C8C8F8",
  moonShade: "#9898C8",
  horizon: "#5050C0",
} as const;

/** Card & knob blends */
export const CARD = {
  bg: "#F9F4E8",
  knobLight: "#EEE8D8",
} as const;

/** Hour knob day gradient — vibrant golden top, light hue bottom */
export const KNOB_DAY = {
  top: "#E0A028", // vibrant golden
  bot: "#FDF8F0", // lighter hue (warm near-white)
} as const;

/** Page background radial gradients (brand tints) */
export const PAGE_BG = {
  red: "rgba(166, 50, 50, 0.10)",
  green: "rgba(45, 90, 67, 0.08)",
  gold: "rgba(197, 160, 89, 0.07)",
} as const;

/** Form input & toggle — frosted glass, matches nav */
export const INPUT = {
  bg: "rgba(255,255,255,0.75)",
  border: "rgba(0,0,0,0.06)",
  hover: "rgba(255,255,255,0.88)",
} as const;

/** Lunar toggle — track when off, accent when on */
export const LUNAR_TOGGLE = {
  trackOff: "rgba(0,0,0,0.08)",
  trackOn: BRAND.gold,
  thumb: "#FFFFFF",
  thumbShade: "rgba(0,0,0,0.06)",
} as const;

/** Nav bar buttons — matches card form elements (rounded-xl, subtle borders) */
export const NAV = {
  day: {
    color: "#1A1A1A",
    bg: "rgba(255,255,255,0.65)",
    border: "rgba(0,0,0,0.06)",
    hoverBg: "rgba(255,255,255,0.85)",
  },
  night: {
    color: "#FFFFFF",
    bg: "rgba(255,255,255,0.12)",
    border: "rgba(255,255,255,0.15)",
    hoverBg: "rgba(255,255,255,0.22)",
  },
} as const;
