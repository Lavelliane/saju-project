"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { InterpretedAnalysis } from "@/lib/saju/types";
import { AiReadingPanel } from "./ai-reading-panel";
import { OhengChart } from "./oheng-chart";
import { PillarCard } from "./pillar-card";
import { SinsalPanel } from "./sinsal-panel";

interface SajuResultsProps {
  analysis: InterpretedAnalysis;
  aiText: string | undefined;
  isAiLoading: boolean;
}

export function SajuResults({ analysis, aiText, isAiLoading }: SajuResultsProps) {
  const { saju, twelveStages, oheng, interpreted } = analysis;

  const stageMap = Object.fromEntries(twelveStages.map((s) => [s.pillar, s]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Your Four Pillars</h2>
        <p className="text-sm text-muted-foreground mb-4">사주팔자 — The pillars of your destiny</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <PillarCard position="year" pillar={saju.yearPillar} stage={stageMap.year} />
          <PillarCard position="month" pillar={saju.monthPillar} stage={stageMap.month} />
          <PillarCard position="day" pillar={saju.dayPillar} stage={stageMap.day} />
          <PillarCard position="hour" pillar={saju.hourPillar} stage={stageMap.hour} />
        </div>
      </div>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="ai">✨ AI Reading</TabsTrigger>
          <TabsTrigger value="sinsal">신살 Influences</TabsTrigger>
          <TabsTrigger value="oheng">오행 Elements</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="mt-4">
          <AiReadingPanel text={aiText} isLoading={isAiLoading} />
        </TabsContent>

        <TabsContent value="sinsal" className="mt-4">
          <SinsalPanel interpreted={interpreted} />
        </TabsContent>

        <TabsContent value="oheng" className="mt-4">
          <OhengChart oheng={oheng} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
