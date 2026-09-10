"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";

import { CreatorImage } from "@/components/ui/CreatorImage";
import { cn } from "@/lib/utilities/cn";
import type { PublicCreatorCard } from "@/lib/utilities/creator-card";

type CreatorRailProps = {
  creators: PublicCreatorCard[];
};

export function CreatorRail({ creators }: CreatorRailProps) {
  const reducedMotion = useReducedMotion();

  if (creators.length === 0) {
    return null;
  }

  const copies = reducedMotion ? [0] : [0, 1];

  return (
    <div className="relative overflow-hidden pb-10">
      <ul
        className={cn(
          "flex w-max gap-6 px-5 py-4 sm:gap-8 sm:px-8 lg:px-12",
          !reducedMotion && "creator-rail",
        )}
      >
        {copies.flatMap((copy) =>
          creators.map((creator, index) => (
            <li
              key={`${copy}-${creator.href}`}
              aria-hidden={copy === 1 ? true : undefined}
              className="w-[min(72vw,18rem)] shrink-0"
            >
              <CreatorPortrait
                creator={creator}
                index={index}
                priority={copy === 0 && index < 3}
              />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

function CreatorPortrait({
  creator,
  index,
  priority,
}: {
  creator: PublicCreatorCard;
  index: number;
  priority?: boolean;
}) {
  const frame = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={creator.href}
      className="group relative block focus-visible:outline-offset-4"
    >
      <p className="mb-3 text-kicker text-oxblood">Frame {frame}</p>
      <CreatorImage
        src={creator.src}
        name={creator.name}
        alt={creator.alt}
        priority={priority}
        sizes="(max-width: 1024px) 72vw, 18rem"
      />
      <span className="mt-4 block">
        <span className="block font-display text-[clamp(1.4rem,2vw,2rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-ink uppercase">
          {creator.name}
        </span>
        <span className="mt-2 block text-kicker text-muted">
          {creator.category}
          {creator.city ? ` · ${creator.city}` : null}
        </span>
      </span>
    </Link>
  );
}
