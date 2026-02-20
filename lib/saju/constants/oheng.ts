import type { Oheng } from "../types/saju";

export const OHENG_KOREAN: Record<Oheng, string> = {
  mok: "목",
  hwa: "화",
  to: "토",
  geum: "금",
  su: "수",
};

export const OHENG_HANJA: Record<Oheng, string> = {
  mok: "木",
  hwa: "火",
  to: "土",
  geum: "金",
  su: "水",
};

/**
 * 상생 관계: key가 key의 value를 생함
 * 목→화, 화→토, 토→금, 금→수, 수→목
 */
export const SANGSAENG: Record<Oheng, Oheng> = {
  mok: "hwa",
  hwa: "to",
  to: "geum",
  geum: "su",
  su: "mok",
};

/**
 * 상극 관계: key가 key의 value를 극함
 * 목→토, 토→수, 수→화, 화→금, 금→목
 */
export const SANGGEUK: Record<Oheng, Oheng> = {
  mok: "to",
  to: "su",
  su: "hwa",
  hwa: "geum",
  geum: "mok",
};

/**
 * 지지 삼합 (三合)
 * 신자진=수국, 해묘미=목국, 인오술=화국, 사유축=금국
 */
export const SAMHAP: Array<{ elements: [number, number, number]; oheng: Oheng }> = [
  { elements: [8, 0, 4], oheng: "su" },
  { elements: [11, 3, 7], oheng: "mok" },
  { elements: [2, 6, 10], oheng: "hwa" },
  { elements: [5, 9, 1], oheng: "geum" },
];

/**
 * 지지 육합 (六合)
 * 자축합토, 인해합목, 묘술합화, 진유합금, 사신합수, 오미합토(화)
 */
export const YUKHAP: Array<[number, number, Oheng]> = [
  [0, 1, "to"],
  [2, 11, "mok"],
  [3, 10, "hwa"],
  [4, 9, "geum"],
  [5, 8, "su"],
  [6, 7, "to"],
];

/**
 * 지지충 (地支沖)
 * 자오충, 축미충, 인신충, 묘유충, 진술충, 사해충
 */
export const JIJICHUNG: Array<[number, number]> = [
  [0, 6],
  [1, 7],
  [2, 8],
  [3, 9],
  [4, 10],
  [5, 11],
];

/**
 * 지지형 (地支刑)
 * 인사형, 사신형, 축술형, 술미형, 자묘형
 */
export const JIJIHYUNG: Array<[number, number]> = [
  [2, 5],
  [5, 8],
  [1, 10],
  [10, 7],
  [0, 3],
];

/**
 * 천간합 (天干合)
 * 갑기합토, 을경합금, 병신합수, 정임합목, 무계합화
 */
export const CHEONGAN_HAP: Array<[number, number, Oheng]> = [
  [0, 5, "to"],
  [1, 6, "geum"],
  [2, 7, "su"],
  [3, 8, "mok"],
  [4, 9, "hwa"],
];
