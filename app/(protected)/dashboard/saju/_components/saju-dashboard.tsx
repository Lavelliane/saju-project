"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { InterpretedAnalysis } from "@/lib/saju/types";
import { useAiInterpretSaju, useInterpretSaju } from "../_hooks";
import type { SajuFormValues } from "../_types";
import { SajuForm } from "./saju-form";
import { SajuResults } from "./saju-results";

function formValuesToInput(values: SajuFormValues) {
  if (!values.birthDate) throw new Error("Birth date is required");
  const d = values.birthDate;
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    isLunar: values.isLunar,
    isLeapMonth: values.isLeapMonth,
    longitude: values.longitude,
  };
}

export function SajuDashboard() {
  const [analysis, setAnalysis] = useState<InterpretedAnalysis | undefined>(undefined);
  const [aiText, setAiText] = useState<string | undefined>(undefined);

  const interpretMutation = useInterpretSaju();
  const aiMutation = useAiInterpretSaju();

  const handleCalculate = async (values: SajuFormValues) => {
    if (!values.birthDate) return;
    setAiText(undefined);
    try {
      const result = await interpretMutation.mutateAsync(formValuesToInput(values));
      setAnalysis(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to calculate pillars");
    }
  };

  const handleAiInterpret = async (values: SajuFormValues, language: "ko" | "en") => {
    if (!values.birthDate) return;
    setAiText(undefined);
    try {
      const result = await aiMutation.mutateAsync({
        ...formValuesToInput(values),
        language,
      });
      setAnalysis(result.analysis);
      setAiText(result.aiInterpretation);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate AI reading");
    }
  };

  return (
    <div className="space-y-8 py-6 px-4 md:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          사주팔자 <span className="text-muted-foreground font-normal text-2xl">Four Pillars</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Discover your destiny through the ancient Korean art of Four Pillars of Destiny
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <SajuForm
            onCalculate={handleCalculate}
            onAiInterpret={handleAiInterpret}
            isCalculating={interpretMutation.isPending}
            isAiLoading={aiMutation.isPending}
          />

          <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              About Saju
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              사주팔자 (Four Pillars of Destiny) is a Korean metaphysical system that uses your
              birth year, month, day, and hour to construct four pillars — each containing a
              Heavenly Stem (천간) and Earthly Branch (지지).
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The <strong>Day Pillar</strong> (일주) represents your core self. The AI reading
              synthesizes all elements into a personalized interpretation.
            </p>
          </div>
        </div>

        <div>
          {analysis ? (
            <SajuResults analysis={analysis} aiText={aiText} isAiLoading={aiMutation.isPending} />
          ) : (
            <EmptyState isLoading={interpretMutation.isPending || aiMutation.isPending} />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-80 rounded-2xl border-2 border-dashed border-muted-foreground/20 text-center p-8 gap-4">
      {isLoading ? (
        <>
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <span className="text-3xl">🔮</span>
          </div>
          <div>
            <p className="font-semibold">Reading the stars...</p>
            <p className="text-sm text-muted-foreground mt-1">Calculating your Four Pillars</p>
          </div>
        </>
      ) : (
        <>
          <div className="size-16 rounded-full bg-muted flex items-center justify-center">
            <span className="text-3xl">🔮</span>
          </div>
          <div>
            <p className="font-semibold text-lg">Your chart awaits</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Enter your birth date and time on the left, then click{" "}
              <strong>Calculate Pillars</strong> or <strong>AI Reading</strong>
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2 opacity-30">
            {["年", "月", "日", "時"].map((c) => (
              <div
                key={c}
                className="size-14 rounded-xl border-2 border-dashed flex items-center justify-center text-2xl font-bold text-muted-foreground"
              >
                {c}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
