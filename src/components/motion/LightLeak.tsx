"use client";

import { m, type MotionValue, useTransform } from "motion/react";

type LightLeakProps = {
  progress: MotionValue<number>;
};

export function LightLeak({ progress }: LightLeakProps) {
  const scaleX = useTransform(progress, [0, 0.55, 1], [1, 10, 42]);
  const scaleY = useTransform(progress, [0, 0.45, 1], [1, 1.4, 2.4]);
  const opacity = useTransform(progress, [0, 0.18, 0.72, 1], [0.9, 1, 0.55, 0.12]);
  const boxShadow = useTransform(
    progress,
    [0, 1],
    [
      "0 0 18px rgba(232, 185, 138, 0.32)",
      "0 0 120px rgba(232, 185, 138, 0.28)",
    ],
  );

  return (
    <m.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] flex justify-center"
      style={{ opacity }}
    >
      <m.div
        className="mt-[8vh] h-[84vh] w-px origin-top bg-[linear-gradient(180deg,rgba(232,185,138,0.05),rgba(249,247,244,0.92)_18%,rgba(232,185,138,0.55)_52%,rgba(249,247,244,0.08))]"
        style={{ boxShadow, scaleX, scaleY }}
      />
    </m.div>
  );
}
