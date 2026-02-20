import {
  TWELVE_STAGE_DESCRIPTIONS,
  TWELVE_STAGE_HANJA,
  TWELVE_STAGE_NAMES,
  TWELVE_STAGES_TABLE,
} from "../constants/twelve-stages-table";
import type { TwelveStageResult } from "../types/analysis";
import type { PillarPosition, SajuResult } from "../types/saju";

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
    { position: "year", jijiId: saju.yearPillar.jiji.id },
    { position: "month", jijiId: saju.monthPillar.jiji.id },
    { position: "day", jijiId: saju.dayPillar.jiji.id },
    { position: "hour", jijiId: saju.hourPillar.jiji.id },
  ];

  return pillars.map(({ position, jijiId }) => {
    const stageIndex = row[jijiId];
    if (stageIndex === undefined) throw new Error(`Invalid jiji id ${jijiId} for twelve stages`);
    const stageName = TWELVE_STAGE_NAMES[stageIndex];
    const hanja = TWELVE_STAGE_HANJA[stageIndex];
    const description = TWELVE_STAGE_DESCRIPTIONS[stageIndex];
    if (!stageName || !hanja || !description)
      throw new Error(`Invalid stage index ${stageIndex} for twelve stages`);
    return { pillar: position, stage: stageName, hanja, description };
  });
}
