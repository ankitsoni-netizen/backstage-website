"use client";

import { m, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { cinematicEase } from "@/lib/motion/variants";

export function ReadyFlash() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.55, once: true });

  return (
    <section
      ref={ref}
      aria-label="Ready"
      className="relative overflow-hidden bg-paper py-16 md:py-24"
    >
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(237,185,138,0.45),transparent_55%)]"
        initial={{ opacity: 0.2, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1.15 } : { opacity: 0.2, scale: 0.7 }}
        transition={{ duration: reducedMotion ? 0 : 0.9, ease: cinematicEase }}
      />
      <p className="relative text-center font-display text-[clamp(3.2rem,10vw,7rem)] leading-[0.92] font-semibold tracking-[-0.05em] uppercase">
        Ready.
      </p>
    </section>
  );
}
