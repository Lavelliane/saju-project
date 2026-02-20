import { calculateSaju } from "../core/saju-calculator";
import type {
  InterpretedAnalysis,
  InterpretedSinsal,
  PowerLevel,
  SinsalResult,
  TwelveStageResult,
} from "../types/analysis";
import type { PillarPosition, SajuInput, SajuResult } from "../types/saju";
import { analyzeOheng } from "./oheng-analyzer";
import { calculateSinsal } from "./sinsal-calculator";
import { calculateTwelveStages } from "./twelve-stages-calculator";

const STAGE_POWER: Record<string, number> = {
  제왕: 1.0,
  건록: 0.9,
  관대: 0.8,
  장생: 0.75,
  목욕: 0.6,
  양: 0.5,
  태: 0.4,
  쇠: 0.3,
  병: 0.2,
  사: 0.1,
  묘: 0.05,
  절: 0.0,
};

const GONGMANG_MULTIPLIER = 0.3;

function getPowerLevel(power: number): PowerLevel {
  if (power >= 0.7) return "strong";
  if (power >= 0.4) return "moderate";
  if (power >= 0.1) return "weak";
  return "negligible";
}

function getGongmangJiji(saju: SajuResult): [number, number] {
  const dayGanId = saju.dayPillar.cheongan.id;
  const dayJijiId = saju.dayPillar.jiji.id;
  const startJiji = (((dayJijiId - dayGanId) % 12) + 12) % 12;
  return [(startJiji + 10) % 12, (startJiji + 11) % 12];
}

function isGongmangPillar(
  saju: SajuResult,
  position: PillarPosition,
  gongmangJiji: [number, number],
): boolean {
  const pillarMap: Record<PillarPosition, number> = {
    year: saju.yearPillar.jiji.id,
    month: saju.monthPillar.jiji.id,
    day: saju.dayPillar.jiji.id,
    hour: saju.hourPillar.jiji.id,
  };
  return gongmangJiji.includes(pillarMap[position]);
}

function interpretGilsin(
  sinsal: SinsalResult,
  stage: TwelveStageResult,
  _power: number,
  level: PowerLevel,
  isGongmang: boolean,
): string {
  const pillarName = { year: "년주", month: "월주", day: "일주", hour: "시주" }[sinsal.pillar];
  if (level === "strong") {
    return `${sinsal.name}이(가) ${pillarName}에서 ${stage.stage}(${stage.hanja}) 위에 있어 강하게 작용합니다. ${sinsal.description}`;
  }
  if (level === "moderate") {
    const gongmangNote = isGongmang ? " 공망의 영향으로 다소 약해졌으나" : "";
    return `${sinsal.name}이(가) ${pillarName} ${stage.stage}(${stage.hanja}) 위에 있어${gongmangNote} 보통 수준으로 작용합니다.`;
  }
  if (level === "weak") {
    const reason = isGongmang
      ? `${stage.stage}에 공망까지 겹쳐`
      : `${stage.stage}(${stage.hanja})의 약한 기운으로`;
    return `${sinsal.name}이(가) ${pillarName}에 있으나 ${reason} 힘이 약합니다. 대운에서 보완될 때 작용할 수 있습니다.`;
  }
  const reason = isGongmang
    ? `${stage.stage}·공망으로 거의 작용하지 못합니다`
    : `${stage.stage}(${stage.hanja})으로 거의 작용하지 못합니다`;
  return `${sinsal.name}이(가) ${pillarName}에 있으나 ${reason}. 대운에서 공망이 풀리는 시기에 활성화될 수 있습니다.`;
}

function interpretHyungsin(
  sinsal: SinsalResult,
  stage: TwelveStageResult,
  _power: number,
  level: PowerLevel,
  isGongmang: boolean,
): string {
  const pillarName = { year: "년주", month: "월주", day: "일주", hour: "시주" }[sinsal.pillar];
  if (level === "strong") {
    return `${sinsal.name}이(가) ${pillarName}에서 ${stage.stage}(${stage.hanja}) 위에 있어 강하게 작용합니다. ${sinsal.description} 주의가 필요합니다.`;
  }
  if (level === "moderate") {
    const gongmangNote = isGongmang ? " 공망의 영향으로 다소 약해졌으나" : "";
    return `${sinsal.name}이(가) ${pillarName} ${stage.stage}(${stage.hanja}) 위에 있어${gongmangNote} 보통 수준으로 작용합니다. 경계는 필요합니다.`;
  }
  if (level === "weak") {
    const reason = isGongmang
      ? `${stage.stage}에 공망까지 겹쳐`
      : `${stage.stage}(${stage.hanja})의 약한 기운으로`;
    return `${sinsal.name}이(가) ${pillarName}에 있으나 ${reason} 흉한 작용이 약합니다. 크게 걱정하지 않아도 됩니다.`;
  }
  const reason = isGongmang
    ? `${stage.stage}·공망으로 흉한 작용이 거의 없어 다행입니다`
    : `${stage.stage}(${stage.hanja})으로 흉한 작용이 거의 없어 다행입니다`;
  return `${sinsal.name}이(가) ${pillarName}에 있으나 ${reason}.`;
}

export function interpretSinsal(
  saju: SajuResult,
  sinsalList: SinsalResult[],
  twelveStages: TwelveStageResult[],
): InterpretedSinsal[] {
  const gongmangJiji = getGongmangJiji(saju);
  const stageMap = new Map<PillarPosition, TwelveStageResult>();
  for (const stage of twelveStages) {
    stageMap.set(stage.pillar, stage);
  }

  return sinsalList.map((sinsal) => {
    const stage = stageMap.get(sinsal.pillar);
    if (!stage) throw new Error(`Missing twelve stage for pillar ${sinsal.pillar}`);
    const gongmang = isGongmangPillar(saju, sinsal.pillar, gongmangJiji);
    const stageScore = STAGE_POWER[stage.stage] ?? 0.5;
    const effectivePower = stageScore * (gongmang ? GONGMANG_MULTIPLIER : 1.0);
    const powerLevel = getPowerLevel(effectivePower);
    const interpretation =
      sinsal.type === "gilsin"
        ? interpretGilsin(sinsal, stage, effectivePower, powerLevel, gongmang)
        : interpretHyungsin(sinsal, stage, effectivePower, powerLevel, gongmang);

    return {
      sinsal,
      twelveStage: stage,
      isGongmang: gongmang,
      effectivePower,
      powerLevel,
      interpretation,
    };
  });
}

export function analyzeInterpreted(input: SajuInput): InterpretedAnalysis {
  const saju = calculateSaju(input);
  return analyzeInterpretedFromResult(saju);
}

export function analyzeInterpretedFromResult(saju: SajuResult): InterpretedAnalysis {
  const sinsalList = calculateSinsal(saju);
  const twelveStages = calculateTwelveStages(saju);
  const oheng = analyzeOheng(saju);
  const interpreted = interpretSinsal(saju, sinsalList, twelveStages);
  return { saju, sinsal: sinsalList, twelveStages, oheng, interpreted };
}
