"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

type SpotlightRevealProps = {
  children: ReactNode;
};

export function SpotlightReveal({ children }: SpotlightRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: ref,
  });
  const scale = useTransform(
    scrollYProgress,
    [0.1, 0.55],
    reducedMotion ? [1, 1] : [0.72, 1],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0.05, 0.4],
    reducedMotion ? [1, 1] : [0.45, 1],
  );

  return (
    <section
      ref={ref}
      id="spotlight"
      className="relative overflow-hidden bg-paper"
    >
      <m.div
        aria-hidden
        className="pointer-events-none absolute top-[-20%] left-1/2 h-[120%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,253,252,1)_0%,rgba(237,185,138,0.38)_36%,rgba(227,223,220,0)_70%)]"
        style={{ opacity, scale }}
      />
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}
