export type Oheng = "mok" | "hwa" | "to" | "geum" | "su";
export type UmYang = "um" | "yang";
export type PillarPosition = "year" | "month" | "day" | "hour";

export interface Cheongan {
  id: number;
  name: string;
  hanja: string;
  oheng: Oheng;
  umyang: UmYang;
}

export interface Jiji {
  id: number;
  name: string;
  hanja: string;
  oheng: Oheng;
  umyang: UmYang;
}

export interface Pillar {
  cheongan: Cheongan;
  jiji: Jiji;
}

export interface SajuResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
}

export interface SajuInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  isLunar?: boolean;
  isLeapMonth?: boolean;
  longitude?: number;
}
