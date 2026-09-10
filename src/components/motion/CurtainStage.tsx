"use client";

import { m, useReducedMotion, type MotionValue, useTransform } from "motion/react";

import { Logo } from "@/components/shared/Logo";

type CurtainStageProps = {
  progress: MotionValue<number>;
};

export function CurtainStage({ progress }: CurtainStageProps) {
  const reducedMotion = useReducedMotion();
  const leftX = useTransform(
    progress,
    [0, 1],
    reducedMotion ? ["-62%", "-62%"] : ["-4%", "-78%"],
  );
  const rightX = useTransform(
    progress,
    [0, 1],
    reducedMotion ? ["62%", "62%"] : ["4%", "78%"],
  );
  const glow = useTransform(progress, [0, 1], reducedMotion ? [0.85, 0.85] : [0.18, 1]);
  const drop = useTransform(progress, [0.12, 0.72], reducedMotion ? [1, 1] : [0.12, 1]);
  const markY = useTransform(progress, [0, 1], reducedMotion ? [0, 0] : [18, 0]);

  return (
    <div className="relative h-full min-h-[48vh] overflow-hidden bg-charcoal text-ivory">
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-[-20%] bg-[radial-gradient(ellipse_at_center,rgba(237,185,138,0.55)_0%,rgba(122,38,52,0.18)_34%,transparent_68%)]"
        style={{ opacity: glow }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent"
      />

      <m.div
        className="absolute inset-[12%] flex flex-col items-center justify-center border border-ivory/10 bg-ivory"
        style={{ opacity: drop }}
      >
        <p className="text-kicker text-oxblood">The house</p>
        <div className="mt-6 px-8">
          <Logo
            className="h-10 w-auto max-w-[min(72%,22rem)] object-contain sm:h-12"
            priority
          />
        </div>
        <m.p
          className="mt-6 max-w-[22ch] text-center font-serif text-lg text-ink/80"
          style={{ y: markY }}
        >
          The crew behind the curtain
        </m.p>
      </m.div>

      <p className="absolute top-5 left-5 z-20 text-[0.62rem] tracking-[0.2em] text-ivory/55 uppercase">
        Call time 09:00
      </p>
      <p className="absolute top-5 right-5 z-20 text-right text-[0.62rem] tracking-[0.2em] text-ivory/55 uppercase">
        Scene 01
      </p>
      <p className="absolute bottom-5 left-5 z-20 text-[0.62rem] tracking-[0.2em] text-ivory/55 uppercase">
        Delhi — India
      </p>
      <p className="absolute right-5 bottom-5 z-20 text-right text-[0.62rem] tracking-[0.2em] text-ivory/55 uppercase">
        House lights
      </p>

      <m.div
        aria-hidden
        className="absolute inset-y-0 left-0 z-10 w-[58%] origin-left"
        style={{ x: leftX }}
      >
        <CurtainPanel edge="right" />
      </m.div>
      <m.div
        aria-hidden
        className="absolute inset-y-0 right-0 z-10 w-[58%] origin-right"
        style={{ x: rightX }}
      >
        <CurtainPanel edge="left" />
      </m.div>
    </div>
  );
}

function CurtainPanel({ edge }: { edge: "left" | "right" }) {
  return (
    <div
      className="h-full w-full shadow-[0_0_40px_rgba(0,0,0,0.45)]"
      style={{
        backgroundImage:
          edge === "right"
            ? "linear-gradient(90deg, #2b1014 0%, #7a2634 18%, #4a151c 36%, #8d3140 52%, #3a1016 70%, #6a1f2c 86%, #1f0a0d 100%)"
            : "linear-gradient(270deg, #2b1014 0%, #7a2634 18%, #4a151c 36%, #8d3140 52%, #3a1016 70%, #6a1f2c 86%, #1f0a0d 100%)",
      }}
    >
      <div
        className="h-full w-full opacity-40 mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 18px, rgba(0,0,0,0.35) 18px 20px, transparent 20px 38px)",
        }}
      />
    </div>
  );
}
