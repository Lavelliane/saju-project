import { useQuery } from "@tanstack/react-query";

export const readingKeys = {
  all: ["saju-readings"] as const,
  lists: () => [...readingKeys.all, "list"] as const,
  detail: (id: string) => [...readingKeys.all, "detail", id] as const,
  stats: () => [...readingKeys.all, "stats"] as const,
};

async function fetchReadings() {
  const res = await fetch("/api/saju/readings");
  if (!res.ok) throw new Error("Failed to fetch readings");
  const json = await res.json();
  return json.data as SajuReadingRow[];
}

async function fetchStats() {
  const res = await fetch("/api/saju/readings/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  const json = await res.json();
  return json.data as { total: number; withAi: number; latest: SajuReadingRow | null };
}

export interface SajuReadingRow {
  id: string;
  userId: string;
  label: string;
  birthDate: string;
  isLunar: string;
  analysis: Record<string, unknown>;
  aiInterpretation: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useReadings() {
  return useQuery({
    queryKey: readingKeys.lists(),
    queryFn: fetchReadings,
  });
}

export function useReadingStats() {
  return useQuery({
    queryKey: readingKeys.stats(),
    queryFn: fetchStats,
  });
}
