import { getPillarByHangul } from "@fullstackfamily/manseryeok";
import { getCheonganById } from "../constants/cheongan";
import { getJijiById } from "../constants/jiji";
import type { Pillar } from "../types/saju";

type ManseryeokPillar = NonNullable<ReturnType<typeof getPillarByHangul>>;

/**
 * manseryeok의 한글 기둥 문자열을 자체 Pillar 타입으로 변환
 * 예: "갑자" → { cheongan: {id:0, name:'갑', ...}, jiji: {id:0, name:'자', ...} }
 */
export function resolvePillar(hangulPillar: string): Pillar {
  const sixtyPillar = getPillarByHangul(hangulPillar);
  if (!sixtyPillar) {
    throw new Error(`Unknown pillar: ${hangulPillar}`);
  }
  return manseryeokPillarToOurPillar(sixtyPillar);
}

/**
 * manseryeok의 SixtyPillar를 자체 Pillar 타입으로 변환
 */
export function manseryeokPillarToOurPillar(sp: ManseryeokPillar): Pillar {
  return {
    cheongan: getCheonganById(sp.tiangan.id),
    jiji: getJijiById(sp.dizhi.id),
  };
}
