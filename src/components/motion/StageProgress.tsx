"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { stageGrowthPath } from "@/lib/content/narrative";

export function StageProgress() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: trackRef,
  });
  const lineScale = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [1, 1] : [0.08, 1],
  );
  const wash = useTransform(scrollYProgress, [0, 1], ["#E3DFDC", "#FFFDFC"]);

  return (
    <>
      <div
        ref={trackRef}
        className="wings-track relative hidden lg:block motion-reduce:lg:hidden"
      >
        <m.div
          className="sticky-stage sticky overflow-hidden"
          style={{ backgroundColor: wash }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-[radial-gradient(ellipse_at_center_bottom,rgba(237,185,138,0.32),transparent_58%)]"
          />
          <div
            aria-hidden
            className="absolute top-[42%] right-[8%] left-[8%] h-[38%] origin-bottom scale-y-[0.35] bg-[linear-gradient(90deg,transparent,rgba(17,17,17,0.06),transparent)]"
            style={{ transform: "perspective(800px) rotateX(62deg)" }}
          />
          <div className="relative mx-auto flex h-full w-full max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
            <ol className="relative grid grid-cols-4 gap-6">
              <m.div
                aria-hidden
                className="absolute top-[1.15rem] right-[4%] left-[4%] h-px origin-left bg-ink"
                style={{ scaleX: lineScale }}
              />
              {stageGrowthPath.map((stage, index) => (
                <AnimatedStageNode
                  key={stage.title}
                  copy={stage.copy}
                  index={index}
                  mark={stage.mark}
                  progress={scrollYProgress}
                  reducedMotion={Boolean(reducedMotion)}
                  title={stage.title}
                />
              ))}
            </ol>
          </div>
        </m.div>
      </div>

      <div className="bg-paper px-5 py-16 text-ink sm:px-8 lg:hidden motion-reduce:lg:block lg:px-12">
        <ol className="relative">
          <span aria-hidden className="absolute top-0 bottom-0 left-[0.35rem] w-px bg-line" />
          {stageGrowthPath.map((stage, index) => (
            <li key={stage.title} className="relative pb-10 pl-8 last:pb-0">
              <span className="absolute top-1.5 left-0 h-2 w-2 bg-oxblood" />
              <p className="text-kicker text-oxblood">
                {stage.mark} / 0{index + 1}
              </p>
              <h3 className="mt-3 font-display text-[1.9rem] leading-[0.88] font-semibold uppercase tracking-[-0.03em]">
                {stage.title}
              </h3>
              <p className="mt-3 max-w-[22rem] text-base leading-relaxed text-muted">
                {stage.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function AnimatedStageNode({
  copy,
  index,
  mark,
  progress,
  reducedMotion,
  title,
}: {
  copy: string;
  index: number;
  mark: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reducedMotion: boolean;
  title: string;
}) {
  const start = index / 4;
  const opacity = useTransform(progress, [start, start + 0.16], [0.22, 1]);
  const glow = useTransform(progress, [start, start + 0.16], [0.12, 1]);

  return (
    <m.li
      className="relative pt-2"
      style={{ opacity: reducedMotion ? 1 : opacity }}
    >
      <m.span
        aria-hidden
        className="mb-6 block h-2.5 w-2.5 bg-oxblood shadow-[0_0_22px_rgba(237,185,138,0.9)]"
        style={{ opacity: reducedMotion ? 1 : glow }}
      />
      <p className="text-kicker text-muted">
        {mark} · In the wings
      </p>
      <h3 className="mt-3 font-display text-[clamp(1.8rem,3.2vw,3rem)] leading-[0.86] font-semibold uppercase tracking-[-0.03em]">
        {title}
      </h3>
      <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-muted md:text-base">
        {copy}
      </p>
    </m.li>
  );
}
