import type { SajuResult, Oheng } from "../types/saju";
import type { OhengBalance, OhengAnalysis } from "../types/analysis";

const OHENG_KEYS: Oheng[] = ["mok", "hwa", "to", "geum", "su"];

/**
 * 오행 분석
 * 8글자(4천간 + 4지지)의 오행을 집계하고 과다/부족을 판별
 */
export function analyzeOheng(saju: SajuResult): OhengAnalysis {
  const balance: OhengBalance = { mok: 0, hwa: 0, to: 0, geum: 0, su: 0 };

  const pillars = [saju.yearPillar, saju.monthPillar, saju.dayPillar, saju.hourPillar];

  for (const pillar of pillars) {
    balance[pillar.cheongan.oheng]++;
    balance[pillar.jiji.oheng]++;
  }

  let strongest: Oheng = "mok";
  let weakest: Oheng = "mok";
  let maxCount = 0;
  let minCount = Number.POSITIVE_INFINITY;

  for (const key of OHENG_KEYS) {
    if (balance[key] > maxCount) {
      maxCount = balance[key];
      strongest = key;
    }
    if (balance[key] < minCount) {
      minCount = balance[key];
      weakest = key;
    }
  }

  const missing = OHENG_KEYS.filter((key) => balance[key] === 0);

  return { balance, strongest, weakest, missing };
}
