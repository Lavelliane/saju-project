"use client";

import { motion, useAnimationFrame, useMotionValue, useTransform } from "motion/react";
import { useRef } from "react";
import { fadeIn, fadeUp, RevealOnScroll } from "./MotionWrapper";

const TESTIMONIALS = [
  {
    name: "Ji-yeon Park",
    handle: "@jiyeon_p",
    avatar: "朴",
    text: "I was skeptical at first, but my Saju reading described my personality so accurately it gave me chills. The 10-year luck cycle analysis helped me understand why the last few years felt so turbulent — and what's coming next.",
    rating: 5,
    tag: "Deep Destiny Reading",
  },
  {
    name: "Marcus Chen",
    handle: "@marcusc",
    avatar: "陳",
    text: "The compatibility reading with my partner was eye-opening. It didn't just say 'you're compatible' — it explained exactly where our energies clash and how to work with it. Genuinely useful.",
    rating: 5,
    tag: "Compatibility Analysis",
  },
  {
    name: "Soo-min Lee",
    handle: "@soominl",
    avatar: "李",
    text: "I've tried Western astrology, Human Design, and MBTI. Saju is on another level. The Four Pillars chart felt like someone had been watching my life and wrote it all down.",
    rating: 5,
    tag: "Foundation Reading",
  },
  {
    name: "Aiko Tanaka",
    handle: "@aiko_t",
    avatar: "田",
    text: "The career analysis was spot-on. I've been in the wrong field for years — my chart showed a strong Water element that thrives in creative, fluid environments. Switched careers and haven't looked back.",
    rating: 5,
    tag: "Deep Destiny Reading",
  },
  {
    name: "David Kim",
    handle: "@davidk",
    avatar: "金",
    text: "What struck me was the nuance. It's not 'you will be rich' or 'you will struggle' — it's a sophisticated map of tendencies, timing, and potential. Exactly what I needed.",
    rating: 5,
    tag: "Deep Destiny Reading",
  },
  {
    name: "Yuna Choi",
    handle: "@yunac",
    avatar: "崔",
    text: "My grandmother used to get her Saju read in Korea. Finding this app felt like reconnecting with something ancient and meaningful. The reading was beautiful and deeply resonant.",
    rating: 5,
    tag: "Foundation Reading",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[#C5A059] text-sm">
          ✦
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[0] }) {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm mx-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
            {t.avatar}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.handle}</p>
          </div>
        </div>
        <StarRating count={t.rating} />
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
      <span className="self-start text-xs font-mono text-primary/70 border border-primary/20 bg-primary/5 px-2.5 py-1 rounded-full">
        {t.tag}
      </span>
    </div>
  );
}

function InfiniteScroll({ speed = 40 }: { speed?: number }) {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWidth = 344; // 320px card + 24px margin
  const totalWidth = cardWidth * TESTIMONIALS.length;

  useAnimationFrame((_, delta) => {
    const current = x.get();
    const next = current - (speed * delta) / 1000;
    x.set(next % -totalWidth);
  });

  const xWrapped = useTransform(x, (v) => {
    const mod = v % -totalWidth;
    return mod > 0 ? mod - totalWidth : mod;
  });

  return (
    <div className="overflow-hidden w-full" ref={containerRef}>
      <motion.div style={{ x: xWrapped }} className="flex w-max">
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <TestimonialCard key={`${t.handle}-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-card/30">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center">
          <RevealOnScroll variants={fadeIn} custom={0}>
            <span className="text-xs tracking-widest uppercase font-mono text-primary">
              Testimonials
            </span>
          </RevealOnScroll>
          <RevealOnScroll variants={fadeUp} custom={1} className="mt-4">
            <h2 className="text-foreground">
              Voices of Those
              <br />
              <span className="text-primary">Who Found Their Path</span>
            </h2>
          </RevealOnScroll>
        </div>
      </div>

      <InfiniteScroll speed={35} />
    </section>
  );
}
