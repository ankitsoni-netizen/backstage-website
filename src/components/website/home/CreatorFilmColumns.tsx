"use client";

import { useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

import { CreatorImage } from "@/components/ui/CreatorImage";
import { cn } from "@/lib/utilities/cn";
import type { PublicCreatorCard } from "@/lib/utilities/creator-card";

const COLUMN_COUNT = 3;
const PORTRAITS_PER_COLUMN = 3;
const DURATIONS = [58, 72, 64];
const DELAYS = ["-22s", "-41s", "-9s"];

type CreatorFilmColumnsProps = {
  creators: PublicCreatorCard[];
};

export function CreatorFilmColumns({ creators }: CreatorFilmColumnsProps) {
  const reducedMotion = useReducedMotion();
  const columns = splitColumns(
    selectPortraits(creators, COLUMN_COUNT * PORTRAITS_PER_COLUMN),
    COLUMN_COUNT,
    PORTRAITS_PER_COLUMN,
  );

  return (
    <div
      aria-hidden
      className="film-stage pointer-events-none absolute inset-y-0 right-0 left-[6%] md:left-[36%] lg:left-[40%]"
    >
      <div className="flex h-full gap-3 px-2 sm:gap-4 sm:px-3 lg:gap-5">
        {columns.map((column, index) => (
          <FilmColumn
            key={`film-col-${index}`}
            className={index === 2 ? "hidden lg:block" : undefined}
            delay={DELAYS[index] ?? "0s"}
            duration={DURATIONS[index] ?? 64}
            items={column}
            priority={index === 0}
            reducedMotion={Boolean(reducedMotion)}
            reverse={index % 2 === 1}
          />
        ))}
      </div>
    </div>
  );
}

function FilmColumn({
  className,
  delay,
  duration,
  items,
  priority,
  reducedMotion,
  reverse,
}: {
  className?: string;
  delay: string;
  duration: number;
  items: PublicCreatorCard[];
  priority: boolean;
  reducedMotion: boolean;
  reverse: boolean;
}) {
  const copies = reducedMotion ? [items] : [items, items];

  return (
    <div className={cn("relative min-w-0 flex-1 overflow-hidden", className)}>
      <div
        className={cn(
          !reducedMotion && (reverse ? "film-col-down" : "film-col-up"),
        )}
        style={
          {
            "--film-delay": delay,
            "--film-duration": `${duration}s`,
          } as CSSProperties
        }
      >
        {copies.map((copy, copyIndex) => (
          <ColumnStack
            key={`stack-${copyIndex}`}
            items={copy}
            priority={priority && copyIndex === 0}
          />
        ))}
      </div>
    </div>
  );
}

function ColumnStack({
  items,
  priority = false,
}: {
  items: PublicCreatorCard[];
  priority?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 pb-3 sm:gap-4 sm:pb-4 lg:gap-5 lg:pb-5">
      {items.map((creator, index) => (
        <div
          key={`${creator.href}-${index}`}
          className="film-portrait relative aspect-[3/4] overflow-hidden rounded-[2px]"
          style={
            {
              "--film-zoom-delay": `${index * 3.4}s`,
            } as CSSProperties
          }
        >
          <CreatorImage
            src={creator.src}
            name={creator.name}
            alt=""
            ratio="fill"
            radius="none"
            priority={priority && index === 0}
            sizes="(max-width: 768px) 42vw, 22vw"
            className="brightness-[0.82] saturate-[0.92]"
          />
        </div>
      ))}
    </div>
  );
}

function selectPortraits(
  creators: PublicCreatorCard[],
  count: number,
): PublicCreatorCard[] {
  const seen = new Set<string>();
  const selected: PublicCreatorCard[] = [];

  for (const creator of creators) {
    if (!creator.src || seen.has(creator.href)) {
      continue;
    }

    seen.add(creator.href);
    selected.push(creator);

    if (selected.length === count) {
      break;
    }
  }

  return selected;
}

function splitColumns(
  creators: PublicCreatorCard[],
  count: number,
  perColumn: number,
): PublicCreatorCard[][] {
  return Array.from({ length: count }, (_, column) =>
    Array.from({ length: perColumn }, (_, index) => {
      return creators[column + index * count] ?? creators[column];
    }).filter((creator): creator is PublicCreatorCard => Boolean(creator)),
  );
}
