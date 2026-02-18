import type { InterpretedAnalysis } from "@/lib/saju/types";

export interface SajuFormValues {
  birthDate: Date | undefined;
  isLunar: boolean;
  isLeapMonth: boolean;
  longitude: number;
}

export interface AiInterpretResponse {
  analysis: InterpretedAnalysis;
  aiInterpretation: string;
}

export interface SajuApiResponse<T> {
  success: boolean;
  data: T;
}
