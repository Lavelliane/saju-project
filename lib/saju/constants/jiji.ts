import type { Jiji } from "../types/saju";

/**
 * 지지 12지 - 자체 오행 매핑 (전통 한국 사주 표준)
 * 인묘=목, 사오=화, 신유=금, 해자=수, 진술축미=토
 */
export const JIJI_LIST: readonly Jiji[] = [
  { id: 0, name: "자", hanja: "子", oheng: "su", umyang: "yang" },
  { id: 1, name: "축", hanja: "丑", oheng: "to", umyang: "um" },
  { id: 2, name: "인", hanja: "寅", oheng: "mok", umyang: "yang" },
  { id: 3, name: "묘", hanja: "卯", oheng: "mok", umyang: "um" },
  { id: 4, name: "진", hanja: "辰", oheng: "to", umyang: "yang" },
  { id: 5, name: "사", hanja: "巳", oheng: "hwa", umyang: "um" },
  { id: 6, name: "오", hanja: "午", oheng: "hwa", umyang: "yang" },
  { id: 7, name: "미", hanja: "未", oheng: "to", umyang: "um" },
  { id: 8, name: "신", hanja: "申", oheng: "geum", umyang: "yang" },
  { id: 9, name: "유", hanja: "酉", oheng: "geum", umyang: "um" },
  { id: 10, name: "술", hanja: "戌", oheng: "to", umyang: "yang" },
  { id: 11, name: "해", hanja: "亥", oheng: "su", umyang: "um" },
] as const;

export function getJijiById(id: number): Jiji {
  const j = JIJI_LIST[id];
  if (!j) throw new Error(`Invalid jiji id: ${id}`);
  return j;
}

export function getJijiByName(name: string): Jiji | undefined {
  return JIJI_LIST.find((j) => j.name === name);
}
