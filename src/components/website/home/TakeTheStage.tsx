"use client";

import Link from "next/link";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";

import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SpotlightReveal } from "@/components/motion/SpotlightReveal";
import { editorialEase } from "@/lib/motion/variants";

export function TakeTheStage() {
  return (
    <SpotlightReveal>
      <Container className="relative py-20 md:py-28">
        <SectionLabel index="07">Take the stage</SectionLabel>
        <h2 className="mt-6 max-w-[14ch] text-display">
          Built backstage. Ready for the spotlight.
        </h2>
        <p className="mt-6 max-w-[34rem] text-base leading-relaxed text-muted md:text-lg">
          First breakout year or next media company—we&apos;re ready to build what
          comes next.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <MagneticTalk />
          <Link
            href="/talent"
            className="inline-flex min-h-11 items-center text-kicker text-muted underline decoration-ink/25 underline-offset-[0.35em] hover:text-oxblood hover:decoration-oxblood"
          >
            Meet the Talent
          </Link>
        </div>
      </Container>
    </SpotlightReveal>
  );
}

function MagneticTalk() {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 22 });
  const springY = useSpring(y, { stiffness: 180, damping: 22 });

  function onMove(event: PointerEvent<HTMLAnchorElement>) {
    if (reducedMotion || event.pointerType !== "mouse") {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.22);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.22);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.a
      href="/contact"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: springX, y: springY }}
      transition={{ ease: editorialEase }}
      className="inline-flex min-h-14 items-center justify-center border border-ink bg-ink px-8 text-sm font-medium tracking-[0.14em] text-ivory uppercase transition-colors duration-300 hover:border-spotlight hover:bg-spotlight hover:text-ink"
    >
      Let&apos;s Talk
    </m.a>
  );
}
