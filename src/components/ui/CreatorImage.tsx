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
  greige: "bg-warm-grey text-ink",
  charcoal: "bg-charcoal text-ivory",
  ivory: "bg-ivory text-ink",
  warm: "bg-spotlight text-ink",
};

type CreatorImageProps = {
  alt: string;
  className?: string;
  crop?: "rect" | "arch" | "square";
  name: string;
  priority?: boolean;
  radius?: "none" | "soft";
  ratio?: "portrait" | "wide" | "square" | "fill";
  sizes?: string;
  src?: string | null;
};

export function CreatorImage({
  alt,
  className,
  crop = "rect",
  name,
  priority = false,
  radius = "none",
  ratio = "portrait",
  sizes = "(max-width: 768px) 100vw, 33vw",
  src,
}: CreatorImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const tone = toneFromName(name || alt);

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        ratio === "wide" && "aspect-[16/10]",
        ratio === "square" && "aspect-square",
        ratio === "portrait" && "aspect-[4/5]",
        ratio === "fill" && "absolute inset-0 h-full w-full",
        crop === "arch" && "crop-arch",
        radius === "soft" && "rounded-[4px]",
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
          className="object-cover motion-safe:origin-center motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.04]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full items-end p-4"
        >
          <span className="font-display text-5xl font-semibold tracking-[-0.03em] uppercase">
            {initialsFromName(name || alt)}
          </span>
        </div>
      )}
    </div>
  );
}
