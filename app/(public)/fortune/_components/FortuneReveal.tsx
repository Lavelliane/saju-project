"use client";

import { gsap } from "gsap";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { BRAND } from "./fortune-colors";

interface FortuneRevealProps {
  children: ReactNode;
}

/** Climactic reveal animation — golden glow burst + card scale-in when fortune is unveiled */
export function FortuneReveal({ children }: FortuneRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    gsap.set(container, { opacity: 0, scale: 0.82 });
    gsap.set(overlay, { opacity: 0.85, scale: 1 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(overlay, {
      opacity: 0,
      scale: 1.4,
      duration: 0.5,
      ease: "power2.in",
    });
    tl.to(
      container,
      {
        opacity: 1,
        scale: 1,
        duration: 0.75,
        ease: "back.out(1.4)",
      },
      "-=0.35",
    );
    tl.set(overlay, { visibility: "hidden" });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Golden glow overlay — bursts outward and fades as card appears */}
      <div
        ref={overlayRef}
        aria-hidden
        className="absolute inset-0 -m-6 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 25%, ${BRAND.gold}88 0%, ${BRAND.gold}44 30%, ${BRAND.gold}18 55%, transparent 75%)`,
        }}
      />
      {children}
    </div>
  );
}
