"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RevealOnScroll, fadeIn, fadeUp, scaleIn } from "./MotionWrapper";

const SERVICES = [
  {
    korean: "기본 사주",
    title: "Foundation Reading",
    price: "Free",
    priceNote: "Always free",
    description:
      "Your core Four Pillars chart with an overview of your elemental balance, dominant energy, and key personality traits.",
    features: ["Four Pillars chart", "Five Elements balance", "Core personality profile", "Dominant energy analysis"],
    cta: "Start Free",
    href: "/register",
    highlight: false,
    accent: "#4A8B82",
  },
  {
    korean: "심층 사주",
    title: "Deep Destiny Reading",
    price: "$29",
    priceNote: "One-time",
    description:
      "A comprehensive analysis of your life path — relationships, career, health, and your 10-year major luck cycles (대운).",
    features: [
      "Everything in Foundation",
      "10-year luck cycles (대운)",
      "Relationship compatibility",
      "Career & wealth analysis",
      "Health tendencies",
      "Annual fortune (세운)",
    ],
    cta: "Get Deep Reading",
    href: "/register",
    highlight: true,
    accent: "#A63232",
  },
  {
    korean: "궁합 분석",
    title: "Compatibility Analysis",
    price: "$19",
    priceNote: "Per pair",
    description:
      "Discover the cosmic harmony between you and a partner, friend, or colleague through a detailed Saju compatibility report.",
    features: [
      "Dual chart comparison",
      "Elemental harmony score",
      "Relationship strengths",
      "Potential friction points",
      "Best timing for milestones",
    ],
    cta: "Check Compatibility",
    href: "/register",
    highlight: false,
    accent: "#C5A059",
  },
];

export function ServicesSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-5 pointer-events-none select-none flex items-center justify-center">
        <span className="text-[22rem] font-bold text-foreground leading-none">주</span>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <RevealOnScroll variants={fadeIn} custom={0}>
            <span className="text-xs tracking-widest uppercase font-mono text-primary">Readings</span>
          </RevealOnScroll>
          <RevealOnScroll variants={fadeUp} custom={1} className="mt-4">
            <h2 className="text-foreground">
              Choose Your<br />
              <span className="text-primary">Path of Insight</span>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll variants={fadeUp} custom={2} className="mt-6 max-w-lg mx-auto">
            <p className="text-muted-foreground text-lg">
              From a free foundation reading to a full destiny deep-dive — find the reading that speaks to you.
            </p>
          </RevealOnScroll>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {SERVICES.map((service, i) => (
            <RevealOnScroll key={service.title} variants={scaleIn} custom={i}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`relative flex flex-col gap-6 p-8 rounded-3xl border transition-all duration-300 h-full ${
                  service.highlight
                    ? "border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                {service.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#C5A059] text-[#2B2B2B] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Top accent */}
                <div
                  className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-50"
                  style={{ background: service.highlight ? "rgba(249,244,232,0.4)" : service.accent }}
                />

                {/* Korean label */}
                <div>
                  <span
                    className={`text-xs font-mono tracking-widest uppercase ${
                      service.highlight ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {service.korean}
                  </span>
                  <h4
                    className={`mt-1 font-bold ${
                      service.highlight ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {service.title}
                  </h4>
                </div>

                {/* Price */}
                <div className="flex items-end gap-2">
                  <span
                    className={`text-4xl font-bold leading-none ${
                      service.highlight ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {service.price}
                  </span>
                  <span
                    className={`text-sm mb-1 ${
                      service.highlight ? "text-primary-foreground/60" : "text-muted-foreground"
                    }`}
                  >
                    {service.priceNote}
                  </span>
                </div>

                <p
                  className={`text-sm leading-relaxed ${
                    service.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {service.description}
                </p>

                {/* Features */}
                <ul className="flex flex-col gap-2.5 flex-1">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-0.5 text-base leading-none ${
                          service.highlight ? "text-primary-foreground/70" : "text-primary"
                        }`}
                      >
                        ✦
                      </span>
                      <span
                        className={service.highlight ? "text-primary-foreground/90" : "text-foreground"}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  className={`w-full rounded-full mt-2 ${
                    service.highlight
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : ""
                  }`}
                  variant={service.highlight ? "default" : "outline"}
                >
                  <Link href={service.href}>{service.cta}</Link>
                </Button>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
