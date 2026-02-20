import { calculateSaju } from "../core/saju-calculator";
import type { FullAnalysis } from "../types/analysis";
import type { SajuInput, SajuResult } from "../types/saju";
import { analyzeOheng } from "./oheng-analyzer";
import { calculateSinsal } from "./sinsal-calculator";
import { calculateTwelveStages } from "./twelve-stages-calculator";

export { analyzeInterpreted, analyzeInterpretedFromResult, interpretSinsal } from "./interpreter";
export { analyzeOheng } from "./oheng-analyzer";
export { calculateSinsal } from "./sinsal-calculator";
export { calculateTwelveStages } from "./twelve-stages-calculator";

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
