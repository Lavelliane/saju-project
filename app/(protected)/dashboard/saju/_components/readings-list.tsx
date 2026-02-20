"use client";

import { formatDistanceToNow } from "date-fns";
import { Clock, PlusCircle, Search, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { SajuReadingRow } from "../_hooks";
import { useDeleteReading, useReadings } from "../_hooks";

export function ReadingsList() {
  const { data: readings, isLoading } = useReadings();
  const deleteMutation = useDeleteReading();
  const [search, setSearch] = useState("");

  const filtered = (readings ?? []).filter((r) =>
    r.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string, label: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`"${label}" deleted`);
    } catch {
      toast.error("Failed to delete reading");
    }
  };

  return (
    <div className="py-6 px-4 md:px-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Readings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {readings?.length ?? 0} saved {readings?.length === 1 ? "reading" : "readings"}
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shrink-0"
        >
          <Link href="/dashboard/saju/new">
            <PlusCircle className="size-4 mr-2" />
            New Reading
          </Link>
        </Button>
      </div>

      {!isLoading && (readings?.length ?? 0) > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search readings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <span className="text-5xl">🔮</span>
            <div>
              <p className="font-semibold text-lg">
                {search ? "No readings match your search" : "No readings yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {search
                  ? "Try a different search term"
                  : "Create your first Saju reading to get started"}
              </p>
            </div>
            {!search && (
              <Button
                asChild
                className="mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0"
              >
                <Link href="/dashboard/saju/new">
                  <PlusCircle className="size-4 mr-2" />
                  Create First Reading
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((reading) => (
            <ReadingCard
              key={reading.id}
              reading={reading}
              onDelete={() => handleDelete(reading.id, reading.label)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReadingCard({
  reading,
  onDelete,
  isDeleting,
}: {
  reading: SajuReadingRow;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all group overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-indigo-500" />
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{reading.label}</p>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
              <Clock className="size-3 shrink-0" />
              <span>{formatDistanceToNow(new Date(reading.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {reading.aiInterpretation ? (
            <Badge
              variant="outline"
              className="text-[10px] border-violet-200 text-violet-600 dark:border-violet-800 dark:text-violet-400"
            >
              <Sparkles className="size-2.5 mr-1" />
              AI Reading
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px]">
              Chart only
            </Badge>
          )}
          {reading.isLunar === "true" && (
            <Badge variant="outline" className="text-[10px]">
              음력
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1 h-7 text-xs">
            <Link href={`/dashboard/saju/${reading.id}`}>View</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="flex-1 h-7 text-xs bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:from-violet-700 hover:to-indigo-700"
          >
            <Link href={`/dashboard/saju/${reading.id}?ai=true`}>
              <Sparkles className="size-3 mr-1" />
              AI Read
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
