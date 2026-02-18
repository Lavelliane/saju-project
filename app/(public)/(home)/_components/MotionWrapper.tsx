"use client";

import { type Variants, motion, useInView } from "motion/react";
import { useRef } from "react";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay: i * 0.1 },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.1 },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_OUT, delay: i * 0.12 },
  }),
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay: i * 0.1 },
  }),
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay: i * 0.1 },
  }),
};

export function RevealOnScroll({
  children,
  className,
  variants = fadeUp,
  custom = 0,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  custom?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={custom}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { motion };
