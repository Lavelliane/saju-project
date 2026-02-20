"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KnobDatePicker, type KnobDateValue } from "./KnobDatePicker";

/* ─── props ─────────────────────────────────────────────── */
interface FortuneFormProps {
  onSubmit: (data: {
    name: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    isLunar: boolean;
  }) => void;
  isLoading: boolean;
}

/* ─── component ──────────────────────────────────────────── */
export function FortuneForm({ onSubmit, isLoading }: FortuneFormProps) {
  const [name, setName] = useState("");
  const [isLunar, setIsLunar] = useState(false);
  const [nameError, setNameError] = useState("");

  /* Knob picker state — sensible defaults */
  const [wheel, setWheel] = useState<KnobDateValue>({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Please enter your name.");
      return;
    }
    setNameError("");
    onSubmit({ name: name.trim(), ...wheel, isLunar });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Name ── */}
      <div className="space-y-2">
        <label htmlFor="fortune-name" className="label text-foreground/70">
          Your Name
        </label>
        <input
          id="fortune-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError("");
          }}
          placeholder="Enter your name"
          autoComplete="off"
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
        <AnimatePresence>
          {nameError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-destructive font-mono"
            >
              {nameError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Birthday knob picker ── */}
      <div className="space-y-2" role="group" aria-labelledby="fortune-birthday-label">
        <div className="flex items-center justify-between" id="fortune-birthday-label">
          <span className="label text-foreground/70">Date & Time of Birth</span>
          <span className="text-[10px] text-muted-foreground font-mono tracking-wider">
            Drag · Scroll · Tap
          </span>
        </div>
        <KnobDatePicker value={wheel} onChange={setWheel} />
        <p className="text-[10px] text-muted-foreground font-mono text-center">
          Hour improves accuracy · 시간이 정확할수록 좋습니다
        </p>
      </div>

      {/* ── Lunar toggle ── */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card">
        <div>
          <p className="text-sm font-medium text-foreground">Lunar Calendar · 음력</p>
          <p className="text-xs text-muted-foreground">
            Enable if your birthday follows the lunar calendar
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isLunar}
          onClick={() => setIsLunar((p) => !p)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            isLunar ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              isLunar ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* ── Submit ── */}
      <Button
        type="submit"
        size="xl"
        disabled={isLoading}
        className="w-full rounded-xl text-base font-medium tracking-wide"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full"
            />
            Reading the Stars...
          </span>
        ) : (
          "Reveal My Saju · 사주 보기"
        )}
      </Button>
    </form>
  );
}
