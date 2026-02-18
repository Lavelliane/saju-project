"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/helpers/utils";

interface AiReadingPanelProps {
  text: string | undefined;
  isLoading: boolean;
}

function parseSection(text: string): Array<{ title: string; body: string }> {
  const lines = text.split("\n");
  const sections: Array<{ title: string; body: string }> = [];
  let current: { title: string; body: string[] } | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,3}\s+\*?\*?(.+?)\*?\*?\s*$/);
    const boldMatch = line.match(/^\*\*(.+?)\*\*\s*[—–-]?\s*(.*)$/);

    if (headingMatch) {
      if (current) sections.push({ title: current.title, body: current.body.join("\n").trim() });
      current = { title: headingMatch[1]!, body: [] };
    } else if (boldMatch && boldMatch[1] && boldMatch[1].length < 80) {
      if (current) sections.push({ title: current.title, body: current.body.join("\n").trim() });
      current = { title: boldMatch[1], body: boldMatch[2] ? [boldMatch[2]] : [] };
    } else if (current && line.trim()) {
      current.body.push(line);
    }
  }
  if (current) sections.push({ title: current.title, body: current.body.join("\n").trim() });
  return sections.filter((s) => s.title && s.body);
}

const SECTION_EMOJIS: Record<string, string> = {
  "Overall": "🌟", "Character": "🌟", "성격": "🌟", "운명": "🌟",
  "Strengths": "💪", "Talents": "💪", "강점": "💪", "재능": "💪",
  "Challenges": "⚡", "과제": "⚡", "도전": "⚡",
  "Relationships": "❤️", "인간관계": "❤️",
  "Career": "💼", "Wealth": "💼", "직업": "💼", "재물": "💼",
  "Spiritual": "✨", "신살": "✨",
  "Advice": "🧭", "조언": "🧭",
};

function getSectionEmoji(title: string): string {
  for (const [key, emoji] of Object.entries(SECTION_EMOJIS)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return emoji;
  }
  return "📖";
}

export function AiReadingPanel({ text, isLoading }: AiReadingPanelProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));
  const [copied, setCopied] = useState(false);

  const sections = text ? parseSection(text) : [];
  const hasSections = sections.length > 1;

  const toggleSection = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="size-4 text-violet-600 dark:text-violet-400" />
            AI Saju Reading
            <span className="text-sm font-normal text-muted-foreground">(AI 사주 해석)</span>
          </CardTitle>
          {text && (
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs">
              {copied ? <Check className="size-3 mr-1 text-emerald-500" /> : <Copy className="size-3 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4 animate-pulse text-violet-500" />
              <span>Consulting the stars...</span>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !text && (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <div className="size-14 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
              <Sparkles className="size-6 text-violet-500" />
            </div>
            <div>
              <p className="text-sm font-medium">No reading yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click <strong>AI Reading</strong> to generate your personalized Saju interpretation
              </p>
            </div>
          </div>
        )}

        {!isLoading && text && (
          <div className="space-y-2">
            {hasSections ? (
              sections.map((section, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-violet-100 dark:border-violet-900/40 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-violet-50/50 dark:hover:bg-violet-950/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{getSectionEmoji(section.title)}</span>
                      <span className="text-sm font-semibold">{section.title}</span>
                    </div>
                    {expanded.has(i) ? (
                      <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {expanded.has(i) && (
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {section.body}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{text}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
