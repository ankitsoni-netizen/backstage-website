"use client";

import { m, type MotionValue, useTransform } from "motion/react";
import type { ReactNode } from "react";

type CurtainRevealProps = {
  children: ReactNode;
  progress: MotionValue<number>;
};

export function CurtainReveal({ children, progress }: CurtainRevealProps) {
  const leftX = useTransform(progress, [0, 0.18, 1], ["0%", "-8%", "-102%"]);
  const rightX = useTransform(progress, [0, 0.18, 1], ["0%", "8%", "102%"]);
  const gapGlow = useTransform(progress, [0, 0.3, 0.8], [0.7, 0.35, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[3]">
      <m.div
        aria-hidden
        className="curtain-panel curtain-left absolute inset-y-0 left-0 w-[51%] origin-left shadow-[12px_0_40px_rgba(0,0,0,0.35)]"
        style={{ x: leftX }}
      />
      <m.div
        aria-hidden
        className="curtain-panel curtain-right absolute inset-y-0 right-0 w-[51%] origin-right shadow-[-12px_0_40px_rgba(0,0,0,0.35)]"
        style={{ x: rightX }}
      />
      <m.div
        aria-hidden
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ivory/80"
        style={{ opacity: gapGlow }}
      />
      <div className="pointer-events-auto absolute inset-0 z-[4]">{children}</div>
    </div>
  );
}
