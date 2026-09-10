"use client";

import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { backstageCapabilities } from "@/lib/content/capabilities";

const TOTAL = backstageCapabilities.length;
const ANGLE = 52;

export function BackstageCapabilitiesCylinder() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: trackRef,
  });
  const rotateX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -ANGLE * (TOTAL - 1)],
  );
  const [active, setActive] = useState(0);
  const [radius, setRadius] = useState(160);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    function updateRadius() {
      setRadius(media.matches ? 205 : 132);
    }

    updateRadius();
    media.addEventListener("change", updateRadius);
    return () => media.removeEventListener("change", updateRadius);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.round(value * (TOTAL - 1));
    setActive((prev) => (prev === next ? prev : next));
  });

  if (reducedMotion === true) {
    return <CapabilitiesAccordion />;
  }

  return (
    <div ref={trackRef} className="capabilities-track relative">
      <div className="capabilities-stage bg-ink">
        <div className="mx-auto grid h-full w-full max-w-[1440px] grid-rows-[auto_minmax(0,1fr)] gap-6 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-10 lg:px-12 lg:py-10">
          <div className="lg:col-span-7">
            <p className="text-kicker text-oxblood">Connected capabilities</p>
            <p className="mt-4 hidden max-w-[34rem] text-base leading-relaxed text-ivory/70 md:block md:text-lg">
              Not a booking desk. A house. Dealcraft, creative, partnerships,
              legal, finance and IP work as one crew — so talent can own the
              spotlight and the business behind it.
            </p>

            <div
              className="relative mt-6 h-[min(38vh,16.5rem)] lg:mt-10 lg:h-[min(58vh,28rem)]"
              style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
            >
              <m.ul
                className="absolute inset-0"
                style={{
                  rotateX,
                  transformOrigin: "center center",
                  transformStyle: "preserve-3d",
                }}
              >
                {backstageCapabilities.map((capability, index) => (
                  <CylinderWord
                    key={capability.title}
                    index={index}
                    progress={scrollYProgress}
                    radius={radius}
                    title={capability.title}
                  />
                ))}
              </m.ul>
            </div>
          </div>

          <div className="flex flex-col justify-end lg:col-span-5 lg:h-[min(58vh,28rem)]">
            <div className="mb-6 h-px w-full bg-ivory/15">
              <m.span
                aria-hidden
                className="block h-px origin-left bg-oxblood"
                style={{ scaleX: scrollYProgress }}
              />
            </div>

            <div className="relative min-h-[12.5rem]">
              {backstageCapabilities.map((capability, index) => (
                <article
                  key={capability.title}
                  aria-hidden={index !== active}
                  className="absolute inset-0 flex flex-col justify-center transition-opacity duration-500"
                  style={{
                    opacity: index === active ? 1 : 0,
                    pointerEvents: index === active ? "auto" : "none",
                  }}
                >
                  <p className="text-kicker text-oxblood">{capability.number}</p>
                  <p className="mt-5 max-w-[32rem] text-lg leading-relaxed text-ivory/80 md:text-xl">
                    {capability.copy}
                  </p>
                  <p className="mt-5 font-serif text-xl text-ivory md:text-2xl">
                    {capability.outcome}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8">
              <Button href="/contact" variant="light">
                Let&apos;s Talk
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CylinderWord({
  index,
  progress,
  radius,
  title,
}: {
  index: number;
  progress: MotionValue<number>;
  radius: number;
  title: string;
}) {
  const opacity = useTransform(progress, (value) => {
    const delta = angleDelta(index, value);
    if (delta > 100) {
      return 0;
    }
    if (delta < 18) {
      return 1;
    }
    return Math.max(0, 1 - (delta - 18) / 70);
  });
  const color = useTransform(progress, (value) => {
    const delta = angleDelta(index, value);
    return delta < 26 ? "#c8102e" : "rgba(255,255,255,0.28)";
  });

  return (
    <li
      className="absolute inset-0 flex items-center"
      style={{
        backfaceVisibility: "hidden",
        transform: `rotateX(${index * ANGLE}deg) translateZ(${radius}px)`,
      }}
    >
      <m.span
        className="font-display text-[clamp(1.7rem,5.2vw,4.8rem)] leading-[0.88] font-semibold tracking-[-0.045em] uppercase"
        style={{ color, opacity }}
      >
        {title}
      </m.span>
    </li>
  );
}

function angleDelta(index: number, progress: number) {
  const current = progress * (TOTAL - 1) * ANGLE;
  let delta = index * ANGLE - current;
  delta = ((delta % 360) + 360) % 360;
  if (delta > 180) {
    delta -= 360;
  }
  return Math.abs(delta);
}

export function CapabilitiesAccordion() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <p className="text-kicker text-oxblood">Connected capabilities</p>
      <p className="mt-4 max-w-[34rem] text-lg leading-relaxed text-ivory/70">
        Not a booking desk. A house. Dealcraft, creative, partnerships, legal,
        finance and IP work as one crew — so talent can own the spotlight and
        the business behind it.
      </p>
      <div className="mt-10 flex flex-col">
        {backstageCapabilities.map((capability, index) => (
          <details
            key={capability.title}
            className="group border-b border-ivory/15 py-5 first:border-t"
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <span className="flex items-baseline gap-4">
                <span className="text-kicker text-oxblood">
                  {capability.number}
                </span>
                <span className="font-display text-[clamp(1.8rem,7vw,2.8rem)] leading-none font-semibold tracking-[-0.03em] uppercase">
                  {capability.title}
                </span>
              </span>
            </summary>
            <p className="mt-4 max-w-[36rem] text-base leading-relaxed text-ivory/75">
              {capability.copy}
            </p>
            <p className="mt-3 font-serif text-lg text-ivory">
              {capability.outcome}
            </p>
          </details>
        ))}
      </div>
      <div className="mt-10">
        <Button href="/contact" variant="light">
          Let&apos;s Talk
        </Button>
      </div>
    </div>
  );
}
