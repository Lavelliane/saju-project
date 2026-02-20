import type { Cheongan } from "../types/saju";

export const CHEONGAN_LIST: readonly Cheongan[] = [
  { id: 0, name: "갑", hanja: "甲", oheng: "mok", umyang: "yang" },
  { id: 1, name: "을", hanja: "乙", oheng: "mok", umyang: "um" },
  { id: 2, name: "병", hanja: "丙", oheng: "hwa", umyang: "yang" },
  { id: 3, name: "정", hanja: "丁", oheng: "hwa", umyang: "um" },
  { id: 4, name: "무", hanja: "戊", oheng: "to", umyang: "yang" },
  { id: 5, name: "기", hanja: "己", oheng: "to", umyang: "um" },
  { id: 6, name: "경", hanja: "庚", oheng: "geum", umyang: "yang" },
  { id: 7, name: "신", hanja: "辛", oheng: "geum", umyang: "um" },
  { id: 8, name: "임", hanja: "壬", oheng: "su", umyang: "yang" },
  { id: 9, name: "계", hanja: "癸", oheng: "su", umyang: "um" },
] as const;

export function getCheonganById(id: number): Cheongan {
  const c = CHEONGAN_LIST[id];
  if (!c) throw new Error(`Invalid cheongan id: ${id}`);
  return c;
}

export function getCheonganByName(name: string): Cheongan | undefined {
  return CHEONGAN_LIST.find((c) => c.name === name);
}
