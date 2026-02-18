import type { SajuInput, SajuResult } from "../types/saju";
import type { FullAnalysis } from "../types/analysis";
import { calculateSaju } from "../core/saju-calculator";
import { calculateSinsal } from "./sinsal-calculator";
import { calculateTwelveStages } from "./twelve-stages-calculator";
import { analyzeOheng } from "./oheng-analyzer";

export { calculateSinsal } from "./sinsal-calculator";
export { calculateTwelveStages } from "./twelve-stages-calculator";
export { analyzeOheng } from "./oheng-analyzer";
export { interpretSinsal, analyzeInterpreted, analyzeInterpretedFromResult } from "./interpreter";

export function analyzeFullSaju(input: SajuInput): FullAnalysis {
  const saju = calculateSaju(input);
  return analyzeFromResult(saju);
}

export function analyzeFromResult(saju: SajuResult): FullAnalysis {
  return {
    saju,
    sinsal: calculateSinsal(saju),
    twelveStages: calculateTwelveStages(saju),
    oheng: analyzeOheng(saju),
  };
}
