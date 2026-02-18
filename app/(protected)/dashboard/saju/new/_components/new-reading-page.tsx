"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SajuForm } from "../../_components/saju-form";
import { SajuResults } from "../../_components/saju-results";
import { useInterpretSaju, useAiInterpretSaju, useSaveReading } from "../../_hooks";
import type { SajuFormValues } from "../../_types";
import type { InterpretedAnalysis } from "@/lib/saju/types";

function formValuesToInput(values: SajuFormValues) {
  const d = values.birthDate!;
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

export function NewReadingPage() {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [analysis, setAnalysis] = useState<InterpretedAnalysis | undefined>(undefined);
  const [aiText, setAiText] = useState<string | undefined>(undefined);
  const [lastValues, setLastValues] = useState<SajuFormValues | undefined>(undefined);

  const interpretMutation = useInterpretSaju();
  const aiMutation = useAiInterpretSaju();
  const saveMutation = useSaveReading();

  const handleCalculate = async (values: SajuFormValues) => {
    if (!values.birthDate) return;
    setAiText(undefined);
    setLastValues(values);
    try {
      const result = await interpretMutation.mutateAsync(formValuesToInput(values));
      setAnalysis(result);
      if (!label) {
        setLabel(`Reading ${values.birthDate.toLocaleDateString()}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to calculate pillars");
    }
  };

  const handleAiInterpret = async (values: SajuFormValues, language: "ko" | "en") => {
    if (!values.birthDate) return;
    setAiText(undefined);
    setLastValues(values);
    try {
      const result = await aiMutation.mutateAsync({ ...formValuesToInput(values), language });
      setAnalysis(result.analysis);
      setAiText(result.aiInterpretation);
      if (!label) {
        setLabel(`Reading ${values.birthDate.toLocaleDateString()}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate AI reading");
    }
  };

  const handleSave = async () => {
    if (!analysis || !lastValues?.birthDate) {
      toast.error("Calculate a reading first before saving");
      return;
    }
    const saveLabel = label.trim() || `Reading ${lastValues.birthDate.toLocaleDateString()}`;
    try {
      await saveMutation.mutateAsync({
        label: saveLabel,
        birthDate: lastValues.birthDate.toISOString(),
        isLunar: lastValues.isLunar,
        analysis: analysis as unknown as Record<string, unknown>,
        aiInterpretation: aiText,
      });
      toast.success("Reading saved!");
      router.push("/dashboard/saju");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save reading");
    }
  };

  return (
    <div className="py-6 px-4 md:px-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/dashboard/saju">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h3 className="text-2xl font-bold tracking-tight">New Reading</h3>
          <p className="text-sm text-muted-foreground">사주팔자 — Four Pillars of Destiny</p>
        </div>
      </div>

      {analysis && (
        <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
          <div className="flex-1 min-w-0">
            <Label htmlFor="reading-label" className="text-xs text-muted-foreground mb-1 block">
              Reading name
            </Label>
            <Input
              id="reading-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. My Birth Chart, Mom's Reading..."
              className="h-8 text-sm"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending || !analysis}
            className="shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
          >
            {saveMutation.isPending ? "Saving..." : "Save Reading"}
          </Button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <SajuForm
            onCalculate={handleCalculate}
            onAiInterpret={handleAiInterpret}
            isCalculating={interpretMutation.isPending}
            isAiLoading={aiMutation.isPending}
          />
          <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">About Saju</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              사주팔자 uses your birth year, month, day, and hour to construct four pillars — each containing a Heavenly Stem (천간) and Earthly Branch (지지).
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The <strong>Day Pillar</strong> (일주) represents your core self.
            </p>
          </div>
        </div>

        <div>
          {analysis ? (
            <SajuResults
              analysis={analysis}
              aiText={aiText}
              isAiLoading={aiMutation.isPending}
            />
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
