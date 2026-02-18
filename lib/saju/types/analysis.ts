import type { SajuResult, Oheng, PillarPosition } from "./saju";

export interface SinsalResult {
  name: string;
  hanja: string;
  type: "gilsin" | "hyungsin";
  pillar: PillarPosition;
  description: string;
}

export interface TwelveStageResult {
  pillar: PillarPosition;
  stage: string;
  hanja: string;
  description: string;
}

export interface OhengBalance {
  mok: number;
  hwa: number;
  to: number;
  geum: number;
  su: number;
}

export interface OhengAnalysis {
  balance: OhengBalance;
  strongest: Oheng;
  weakest: Oheng;
  missing: Oheng[];
}

export type PowerLevel = "strong" | "moderate" | "weak" | "negligible";

export interface InterpretedSinsal {
  sinsal: SinsalResult;
  twelveStage: TwelveStageResult;
  isGongmang: boolean;
  effectivePower: number;
  powerLevel: PowerLevel;
  interpretation: string;
}

export interface FullAnalysis {
  saju: SajuResult;
  sinsal: SinsalResult[];
  twelveStages: TwelveStageResult[];
  oheng: OhengAnalysis;
}

export interface InterpretedAnalysis extends FullAnalysis {
  interpreted: InterpretedSinsal[];
}
