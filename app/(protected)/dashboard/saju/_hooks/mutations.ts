import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SajuInput } from "@/lib/saju/types";
import { fetchAiInterpret, fetchInterpret } from "./api";
import { readingKeys } from "./queries";

export function useInterpretSaju() {
  return useMutation({
    mutationFn: (input: SajuInput) => fetchInterpret(input),
  });
}

export function useAiInterpretSaju() {
  return useMutation({
    mutationFn: (input: SajuInput & { language?: "ko" | "en" }) => fetchAiInterpret(input),
  });
}

interface SaveReadingInput {
  label: string;
  birthDate: string;
  isLunar: boolean;
  analysis: Record<string, unknown>;
  aiInterpretation?: string;
}

async function saveReading(input: SaveReadingInput) {
  const res = await fetch("/api/saju/readings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Failed to save reading");
  }
  return res.json();
}

async function deleteReading(id: string) {
  const res = await fetch(`/api/saju/readings/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Failed to delete reading");
  }
  return res.json();
}

export function useSaveReading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveReadingInput) => saveReading(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: readingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: readingKeys.stats() });
    },
  });
}

export function useDeleteReading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReading(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: readingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: readingKeys.stats() });
    },
  });
}
