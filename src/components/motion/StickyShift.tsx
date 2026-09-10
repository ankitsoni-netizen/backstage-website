"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utilities/cn";

type StickyShiftProps = {
  children: ReactNode;
  className?: string;
};

export function StickyShift({ children, className }: StickyShiftProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: ref,
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [28, -28],
  );

  return (
    <div ref={ref} className={cn("md:sticky md:top-28", className)}>
      <m.div style={{ y }} className="will-change-transform">
        {children}
      </m.div>
    </div>
  );
}
