"use client";

import { RotateCcw, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { SajuFormValues } from "../_types";

interface SajuFormProps {
  onCalculate: (values: SajuFormValues) => void;
  onAiInterpret: (values: SajuFormValues, language: "ko" | "en") => void;
  isCalculating: boolean;
  isAiLoading: boolean;
}

export function SajuForm({
  onCalculate,
  onAiInterpret,
  isCalculating,
  isAiLoading,
}: SajuFormProps) {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [isLunar, setIsLunar] = useState(false);
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [language, setLanguage] = useState<"ko" | "en">("en");

  const values: SajuFormValues = { birthDate, isLunar, isLeapMonth, longitude: 127 };

  const isValid = !!birthDate;

  const handleReset = () => {
    setBirthDate(undefined);
    setIsLunar(false);
    setIsLeapMonth(false);
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <span className="text-lg">🔮</span>
          </div>
          <div>
            <CardTitle className="text-xl">사주팔자 분석</CardTitle>
            <CardDescription>
              Enter your birth date and time to reveal your Four Pillars
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Birth Date & Time (생년월일시)</Label>
          <DateTimePicker
            value={birthDate}
            onChange={setBirthDate}
            placeholder="Select birth date and time..."
          />
          <p className="text-xs text-muted-foreground">
            Include the exact birth time for the most accurate Hour Pillar (시주)
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium cursor-pointer" htmlFor="lunar-toggle">
                음력 (Lunar)
              </Label>
              <p className="text-xs text-muted-foreground">Use lunar calendar date</p>
            </div>
            <Switch id="lunar-toggle" checked={isLunar} onCheckedChange={setIsLunar} />
          </div>

          <div
            className={`flex items-center justify-between rounded-lg border p-3 transition-opacity ${!isLunar ? "opacity-40 pointer-events-none" : ""}`}
          >
            <div className="space-y-0.5">
              <Label className="text-sm font-medium cursor-pointer" htmlFor="leap-toggle">
                윤달 (Leap)
              </Label>
              <p className="text-xs text-muted-foreground">Leap month in lunar</p>
            </div>
            <Switch
              id="leap-toggle"
              checked={isLeapMonth}
              onCheckedChange={setIsLeapMonth}
              disabled={!isLunar}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">AI Language:</Label>
          <div className="flex gap-2">
            <Badge
              variant={language === "en" ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => setLanguage("en")}
            >
              English
            </Badge>
            <Badge
              variant={language === "ko" ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => setLanguage("ko")}
            >
              한국어
            </Badge>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => isValid && onCalculate(values)}
            disabled={!isValid || isCalculating || isAiLoading}
          >
            <Search className="size-4 mr-2" />
            {isCalculating ? "Calculating..." : "Calculate Pillars"}
          </Button>

          <Button
            className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
            onClick={() => isValid && onAiInterpret(values, language)}
            disabled={!isValid || isCalculating || isAiLoading}
          >
            <Sparkles className="size-4 mr-2" />
            {isAiLoading ? "Interpreting..." : "AI Reading"}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            disabled={isCalculating || isAiLoading}
            title="Reset"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
