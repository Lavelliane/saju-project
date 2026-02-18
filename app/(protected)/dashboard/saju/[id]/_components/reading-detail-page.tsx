"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useAiInterpretSaju, useDeleteReading } from "../../_hooks";
import { readingKeys } from "../../_hooks/queries";
import { SajuResults } from "../../_components/saju-results";
import type { InterpretedAnalysis } from "@/lib/saju/types";
import type { SajuReadingRow } from "../../_hooks";

async function fetchReading(id: string): Promise<SajuReadingRow> {
  const res = await fetch(`/api/saju/readings/${id}`);
  if (!res.ok) throw new Error("Reading not found");
  const json = await res.json();
  return json.data;
}

async function patchReading(id: string, aiInterpretation: string) {
  const res = await fetch(`/api/saju/readings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ aiInterpretation }),
  });
  if (!res.ok) throw new Error("Failed to update reading");
  return res.json();
}

interface ReadingDetailPageProps {
  paramsPromise: Promise<{ id: string }>;
}

export function ReadingDetailPage({ paramsPromise }: ReadingDetailPageProps) {
  const { id } = use(paramsPromise);
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoAi = searchParams.get("ai") === "true";

  const { data: reading, isLoading, error } = useQuery({
    queryKey: readingKeys.detail(id),
    queryFn: () => fetchReading(id),
  });

  const aiMutation = useAiInterpretSaju();
  const deleteMutation = useDeleteReading();
  const [aiText, setAiText] = useState<string | undefined>(undefined);
  const [hasTriggeredAi, setHasTriggeredAi] = useState(false);

  const analysis = reading?.analysis as unknown as InterpretedAnalysis | undefined;
  const savedAiText = reading?.aiInterpretation ?? undefined;
  const displayAiText = aiText ?? savedAiText;

  const handleAiRead = async () => {
    if (!reading || !analysis) return;
    setHasTriggeredAi(true);
    try {
      const birthDate = new Date(reading.birthDate);
      const result = await aiMutation.mutateAsync({
        year: birthDate.getFullYear(),
        month: birthDate.getMonth() + 1,
        day: birthDate.getDate(),
        hour: birthDate.getHours(),
        minute: birthDate.getMinutes(),
        isLunar: reading.isLunar === "true",
        language: "en",
      });
      setAiText(result.aiInterpretation);
      await patchReading(id, result.aiInterpretation);
      toast.success("AI reading saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate AI reading");
    }
  };

  const handleDelete = async () => {
    if (!reading) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`"${reading.label}" deleted`);
      router.push("/dashboard/saju");
    } catch {
      toast.error("Failed to delete reading");
    }
  };

  if (isLoading) {
    return (
      <div className="py-6 px-4 md:px-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-3 grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !reading || !analysis) {
    return (
      <div className="py-6 px-4 md:px-6 flex flex-col items-center justify-center min-h-60 gap-4 text-center">
        <span className="text-4xl">😶‍🌫️</span>
        <p className="font-semibold">Reading not found</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/saju">Back to readings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:px-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link href="/dashboard/saju">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight truncate">{reading.label}</h1>
            <p className="text-xs text-muted-foreground">
              {new Date(reading.birthDate).toLocaleString()} {reading.isLunar === "true" ? "· 음력" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!displayAiText && (
            <Button
              onClick={handleAiRead}
              disabled={aiMutation.isPending}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
            >
              <Sparkles className="size-4 mr-2" />
              {aiMutation.isPending ? "Reading..." : "AI Reading"}
            </Button>
          )}
          {displayAiText && !hasTriggeredAi && (
            <Button
              onClick={handleAiRead}
              disabled={aiMutation.isPending}
              variant="outline"
              size="sm"
            >
              <Sparkles className="size-3.5 mr-1.5" />
              Regenerate
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <SajuResults
        analysis={analysis}
        aiText={displayAiText}
        isAiLoading={aiMutation.isPending}
      />
    </div>
  );
}
