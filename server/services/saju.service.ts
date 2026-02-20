import { analyzeFromResult, analyzeFullSaju } from "@/lib/saju/analysis";
import { analyzeInterpreted, analyzeInterpretedFromResult } from "@/lib/saju/analysis/interpreter";
import { lunarToSolar, solarToLunar } from "@/lib/saju/core/lunar-converter";
import { calculateSaju } from "@/lib/saju/core/saju-calculator";
import type { CalendarConversionResult, FullAnalysis, InterpretedAnalysis } from "@/lib/saju/types";
import type { SajuInput, SajuResult } from "@/lib/saju/types/saju";

export const sajuService = {
  getPillars(input: SajuInput): SajuResult {
    return calculateSaju(input);
  },

  analyze(input: SajuInput): FullAnalysis {
    return analyzeFullSaju(input);
  },

  analyzeFromResult(saju: SajuResult): FullAnalysis {
    return analyzeFromResult(saju);
  },

  interpret(input: SajuInput): InterpretedAnalysis {
    return analyzeInterpreted(input);
  },

  interpretFromResult(saju: SajuResult): InterpretedAnalysis {
    return analyzeInterpretedFromResult(saju);
  },

  solarToLunar(year: number, month: number, day: number): CalendarConversionResult {
    return solarToLunar(year, month, day);
  },

  lunarToSolar(
    year: number,
    month: number,
    day: number,
    isLeapMonth = false,
  ): CalendarConversionResult {
    return lunarToSolar(year, month, day, isLeapMonth);
  },
};
