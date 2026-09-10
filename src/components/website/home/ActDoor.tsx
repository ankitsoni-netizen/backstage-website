"use client";

import { useReducedMotion, useScroll } from "motion/react";
import { useRef } from "react";

import { CurtainStage } from "@/components/motion/CurtainStage";
import { Button } from "@/components/ui/Button";

export function ActDoor() {
  const trackRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: trackRef,
  });

  return (
    <section
      ref={trackRef}
      id="act-door"
      className="act-door-track relative bg-ivory text-ink motion-reduce:min-h-[calc(100svh-var(--header-offset))]"
    >
      <div className="sticky-stage relative overflow-visible border-b border-line lg:sticky lg:overflow-hidden">
        <div className="mx-auto grid h-full w-full max-w-[1440px] lg:grid-cols-12">
          <div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:col-span-5 lg:px-12">
            <p className="text-kicker text-oxblood">Talent management</p>
            <h1 className="mt-5 text-display">
              Before the spotlight, there&apos;s Backstage.
            </h1>
            <p className="mt-6 max-w-[34rem] text-base leading-relaxed text-muted md:text-lg">
              A full-stack partner for the creator economy — deals, strategy,
              brand work, legal, finance and IP. Not brokers. Builders.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/talent">Meet the talent</Button>
              <Button href="/contact" variant="ghost">
                Let&apos;s Talk
              </Button>
            </div>
            {!reducedMotion ? (
              <p className="mt-8 text-kicker text-muted">Scroll to open the house</p>
            ) : null}
          </div>

          <div className="relative min-h-[52vh] lg:col-span-7 lg:min-h-0">
            <CurtainStage progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}
