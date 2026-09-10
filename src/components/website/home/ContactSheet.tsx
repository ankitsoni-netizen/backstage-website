"use client";

import Link from "next/link";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { CreatorImage } from "@/components/ui/CreatorImage";
import { ProductionMark } from "@/components/ui/ProductionMark";
import type { PublicCreatorCard } from "@/lib/utilities/creator-card";

type ContactSheetProps = {
  creators: PublicCreatorCard[];
};

export function ContactSheet({ creators }: ContactSheetProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: ref,
  });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ["0%", "0%"] : ["4%", "-10%"],
  );
  const frames = creators.slice(0, 7);

  if (frames.length === 0) {
    return null;
  }

  return (
    <section
      ref={ref}
      aria-label="Contact sheet"
      className="overflow-hidden border-y border-line bg-greige py-8 md:py-10"
    >
      <div className="mb-4 flex items-center justify-between px-5 sm:px-8 lg:px-12">
        <ProductionMark label="Contact sheet" />
        <p className="text-kicker text-muted">Frames 01–{String(frames.length).padStart(2, "0")}</p>
      </div>
      <m.ul style={{ x }} className="flex items-start gap-5 px-5 will-change-transform sm:gap-6 sm:px-8 lg:px-12">
        {frames.map((creator, index) => (
          <li
            key={creator.href}
            className="w-[42vw] min-w-[9.5rem] max-w-[14rem] sm:w-[22vw]"
          >
            <Link href={creator.href} className="group block">
              <CreatorImage
                src={creator.src}
                name={creator.name}
                alt={creator.alt}
                ratio="portrait"
                sizes="22vw"
              />
              <p className="mt-3 font-display text-lg leading-tight font-semibold tracking-[-0.03em] uppercase">
                {creator.name}
              </p>
              <p className="mt-1 text-[0.6rem] tracking-[0.16em] text-oxblood uppercase">
                {String(index + 1).padStart(2, "0")} · {creator.category}
              </p>
            </Link>
          </li>
        ))}
      </m.ul>
    </section>
  );
}
