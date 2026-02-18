"use client";

import { motion } from "motion/react";
import { RevealOnScroll, fadeIn, fadeUp, scaleIn } from "./MotionWrapper";

const STEPS = [
  {
    number: "01",
    korean: "입력",
    title: "Enter Your Birth Data",
    description:
      "Provide your birth year, month, day, and hour. This precise moment in time is the foundation of your unique Saju chart.",
    detail: "Year · Month · Day · Hour",
    icon: "🗓",
  },
  {
    number: "02",
    korean: "분석",
    title: "AI-Powered Chart Analysis",
    description:
      "Our system generates your Four Pillars chart and analyzes the interplay of the Ten Heavenly Stems and Twelve Earthly Branches.",
    detail: "천간 · 지지 · 오행",
    icon: "✦",
  },
  {
    number: "03",
    korean: "해석",
    title: "Receive Your Reading",
    description:
      "Get a detailed, personalized interpretation of your destiny — covering personality, relationships, career, and your 10-year luck cycles.",
    detail: "대운 · 세운 · 월운",
    icon: "📜",
  },
];

export function HowItWorksSection() {
  return (
    <section id="services" className="py-32 px-6 bg-card/40 relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#2B2B2B 1px, transparent 1px), linear-gradient(90deg, #2B2B2B 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <RevealOnScroll variants={fadeIn} custom={0}>
            <span className="text-xs tracking-widest uppercase font-mono text-primary">How It Works</span>
          </RevealOnScroll>
          <RevealOnScroll variants={fadeUp} custom={1} className="mt-4">
            <h2 className="text-foreground">
              Three Steps to<br />
              <span className="text-primary">Clarity</span>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll variants={fadeUp} custom={2} className="mt-6 max-w-xl mx-auto">
            <p className="text-muted-foreground text-lg">
              Ancient wisdom meets modern technology. Your reading is ready in minutes.
            </p>
          </RevealOnScroll>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {STEPS.map((step, i) => (
              <RevealOnScroll key={step.number} variants={scaleIn} custom={i}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative flex flex-col items-center text-center gap-6 p-8 rounded-3xl border border-border bg-card shadow-sm hover:border-primary/30 hover:shadow-md transition-colors duration-300"
                >
                  {/* Step number bubble */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-primary/30 bg-primary/5 flex items-center justify-center">
                      <span className="text-xl">{step.icon}</span>
                    </div>
                    <span className="absolute -top-2 -right-2 text-[10px] font-mono font-bold text-primary bg-background border border-primary/30 rounded-full w-6 h-6 flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>

                  {/* Korean label */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl font-bold text-primary/20 leading-none font-mono">
                      {step.korean}
                    </span>
                    <h5 className="text-foreground font-semibold">{step.title}</h5>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>

                  <span className="text-xs font-mono text-primary/70 tracking-wider border border-primary/20 bg-primary/5 px-3 py-1 rounded-full">
                    {step.detail}
                  </span>
                </motion.div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Bottom stat row */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: "2,000+", label: "Years of Tradition" },
            { value: "10", label: "Year Luck Cycles" },
            { value: "60", label: "Unique Pillar Combinations" },
            { value: "∞", label: "Paths of Destiny" },
          ].map((stat, i) => (
            <RevealOnScroll key={stat.label} variants={fadeUp} custom={i}>
              <div className="text-center p-6 rounded-2xl border border-border bg-card/60">
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
