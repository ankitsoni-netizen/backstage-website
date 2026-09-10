"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utilities/cn";
import {
  initialsFromName,
  toneFromName,
  type CreatorFallbackTone,
} from "@/lib/utilities/media";

const toneClassName: Record<CreatorFallbackTone, string> = {
  powder: "bg-powder",
  blush: "bg-blush",
  signal: "bg-signal",
  orange: "bg-orange",
};

type CreatorImageProps = {
  alt: string;
  className?: string;
  name: string;
  priority?: boolean;
  sizes?: string;
  src?: string | null;
};

export function CreatorImage({
  alt,
  className,
  name,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
  src,
}: CreatorImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const tone = toneFromName(name || alt);

  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden",
        !showImage && toneClassName[tone],
        className,
      )}
    >
      {showImage && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover motion-safe:origin-center motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full items-end p-4 text-ink"
        >
          <span className="font-sans text-5xl font-bold tracking-[-0.03em] uppercase">
            {initialsFromName(name || alt)}
          </span>
        </div>
      )}
    </div>
  );
}
