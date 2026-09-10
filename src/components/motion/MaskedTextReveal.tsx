"use client";

import { m, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { editorialEase } from "@/lib/motion/variants";
import { cn } from "@/lib/utilities/cn";

type MaskedTextRevealProps = {
  as?: "h2" | "h3" | "p" | "div";
  className?: string;
  delay?: number;
  lines: string[];
};

export function MaskedTextReveal({
  as: Tag = "div",
  className,
  delay = 0,
  lines,
}: MaskedTextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.45, once: true });

  return (
    <div ref={ref}>
      <Tag className={cn("flex flex-col", className)}>
        {lines.map((line, index) => (
          <span key={line} className="block overflow-hidden py-[0.04em]">
            <m.span
              className="block"
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : { y: "110%" }}
              transition={{
                delay: reducedMotion ? 0 : delay + index * 0.12,
                duration: reducedMotion ? 0 : 0.85,
                ease: editorialEase,
              }}
            >
              {line}
            </m.span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
