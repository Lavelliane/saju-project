"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const PILLARS = [
  { korean: "年", label: "Year", sub: "천간·지지" },
  { korean: "月", label: "Month", sub: "천간·지지" },
  { korean: "日", label: "Day", sub: "천간·지지" },
  { korean: "時", label: "Hour", sub: "천간·지지" },
];

const FLOATING_CHARS = ["사", "주", "팔", "자", "운", "명", "천", "지"];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Ambient background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #A63232 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #C5A059 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #2D5A43 0%, transparent 70%)" }}
        />
      </div>

      {/* Floating Korean characters */}
      {FLOATING_CHARS.map((char, i) => (
        <motion.span
          key={char}
          className="absolute select-none pointer-events-none font-bold opacity-5 text-foreground"
          style={{
            fontSize: `${3 + (i % 3) * 2}rem`,
            left: `${8 + ((i * 11) % 84)}%`,
            top: `${10 + ((i * 13) % 75)}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, i % 2 === 0 ? 5 : -5, 0],
            opacity: [0.04, 0.09, 0.04],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          {char}
        </motion.span>
      ))}

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-6 gap-10"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs tracking-widest uppercase font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Korean Fortune Telling · 사주팔자
          </span>
        </motion.div>

        {/* Main headline */}
        <div className="flex flex-col items-center gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="text-foreground leading-none"
          >
            Your Destiny,
            <br />
            <span className="text-primary">Written in the Stars</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="max-w-xl text-muted-foreground text-lg leading-relaxed"
          >
            Unlock the ancient wisdom of Saju — the Korean art of reading the Four Pillars of
            Destiny. Discover who you are, who you're meant to be, and what the universe has planned
            for you.
          </motion.p>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button asChild size="lg" className="px-8 py-6 text-base rounded-full shadow-lg">
            <Link href="/register">Begin Your Reading</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="px-8 py-6 text-base rounded-full">
            <Link href="/#about">Learn About Saju</Link>
          </Button>
        </motion.div>

        {/* Four Pillars preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="flex items-center gap-3 mt-4"
        >
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.08, y: -4 }}
              className="flex flex-col items-center gap-1 px-4 py-4 rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-sm cursor-default"
            >
              <span className="text-3xl font-bold text-primary leading-none">{pillar.korean}</span>
              <span className="text-xs text-foreground font-medium">{pillar.label}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{pillar.sub}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground tracking-widest uppercase font-mono">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-primary/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
