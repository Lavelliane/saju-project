"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RevealOnScroll, fadeIn, fadeUp } from "./MotionWrapper";

const FOOTER_LINKS = [
  { label: "About Saju", href: "/#about" },
  { label: "How It Works", href: "/#services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Terms", href: "/terms" },
  { label: "Sign In", href: "/login" },
];

export function CtaSection() {
  return (
    <>
      {/* CTA Banner */}
      <section id="faq" className="py-32 px-6 relative overflow-hidden">
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(166,50,50,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Decorative large Korean */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
          <span className="text-[40rem] font-bold text-foreground leading-none">命</span>
        </div>

        <div className="max-w-4xl mx-auto relative text-center flex flex-col items-center gap-10">
          <RevealOnScroll variants={fadeIn} custom={0}>
            <span className="text-xs tracking-widest uppercase font-mono text-primary">
              Begin Your Journey
            </span>
          </RevealOnScroll>

          <RevealOnScroll variants={fadeUp} custom={1}>
            <h2 className="text-foreground">
              The Stars Have Always<br />
              <span className="text-primary">Known Your Name</span>
            </h2>
          </RevealOnScroll>

          <RevealOnScroll variants={fadeUp} custom={2} className="max-w-xl">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Your Saju chart was written the moment you took your first breath. It has been waiting for you ever since. Start with a free reading — no credit card required.
            </p>
          </RevealOnScroll>

          <RevealOnScroll variants={fadeUp} custom={3}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button asChild size="lg" className="px-10 py-6 text-base rounded-full shadow-lg shadow-primary/20">
                  <Link href="/register">Read My Destiny — Free</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button asChild variant="outline" size="lg" className="px-10 py-6 text-base rounded-full">
                  <Link href="/login">Sign In</Link>
                </Button>
              </motion.div>
            </div>
          </RevealOnScroll>

          {/* Trust badges */}
          <RevealOnScroll variants={fadeIn} custom={4}>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5">
                <span className="text-primary">✦</span> 2,000 years of tradition
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-primary">✦</span> Free foundation reading
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-primary">✦</span> No credit card required
              </span>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-mono font-bold text-foreground tracking-widest text-sm uppercase">SAJU</span>
            <span className="text-xs text-muted-foreground">Korean Fortune Telling · 사주팔자</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono tracking-wide uppercase"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} Saju. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
