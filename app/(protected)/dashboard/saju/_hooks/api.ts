import type { SajuInput } from "@/lib/saju/types";
import type { InterpretedAnalysis } from "@/lib/saju/types";
import type { AiInterpretResponse, SajuApiResponse } from "../_types";

export async function fetchInterpret(input: SajuInput): Promise<InterpretedAnalysis> {
  const res = await fetch("/api/saju/interpret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Failed to interpret saju");
  }
  const json: SajuApiResponse<InterpretedAnalysis> = await res.json();
  return json.data;
}

export async function fetchAiInterpret(
  input: SajuInput & { language?: "ko" | "en" },
): Promise<AiInterpretResponse> {
  const res = await fetch("/api/saju/ai-interpret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Failed to generate AI interpretation");
  }
  const json: SajuApiResponse<AiInterpretResponse> = await res.json();
  return json.data;
}
