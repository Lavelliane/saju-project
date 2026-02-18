import type { SajuResult, PillarPosition } from "../types/saju";
import type { TwelveStageResult } from "../types/analysis";
import {
  TWELVE_STAGES_TABLE,
  TWELVE_STAGE_NAMES,
  TWELVE_STAGE_HANJA,
  TWELVE_STAGE_DESCRIPTIONS,
} from "../constants/twelve-stages-table";

/**
 * 12운성 계산
 * 일간(dayPillar.cheongan)을 기준으로 4개 기둥 각각의 지지에 대해 12운성 산출
 */
export function calculateTwelveStages(saju: SajuResult): TwelveStageResult[] {
  const dayGanId = saju.dayPillar.cheongan.id;
  const row = TWELVE_STAGES_TABLE[dayGanId];
  if (!row) {
    throw new Error(`Invalid cheongan id for twelve stages: ${dayGanId}`);
  }

  const pillars: Array<{ position: PillarPosition; jijiId: number }> = [
    { position: "year",  jijiId: saju.yearPillar.jiji.id },
    { position: "month", jijiId: saju.monthPillar.jiji.id },
    { position: "day",   jijiId: saju.dayPillar.jiji.id },
    { position: "hour",  jijiId: saju.hourPillar.jiji.id },
  ];

  return pillars.map(({ position, jijiId }) => {
    const stageIndex = row[jijiId]!;
    return {
      pillar: position,
      stage: TWELVE_STAGE_NAMES[stageIndex]!,
      hanja: TWELVE_STAGE_HANJA[stageIndex]!,
      description: TWELVE_STAGE_DESCRIPTIONS[stageIndex]!,
    };
  });
}
