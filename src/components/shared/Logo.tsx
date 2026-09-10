import Image from "next/image";

import {
  BACKSTAGE_LOGO_HEIGHT,
  BACKSTAGE_LOGO_PATH,
  BACKSTAGE_LOGO_WIDTH,
} from "@/lib/utilities/brand";
import { cn } from "@/lib/utilities/cn";

type LogoProps = {
  className?: string;
  priority?: boolean;
  tone?: "paper" | "ink";
};

export function Logo({
  className,
  priority = false,
  tone = "paper",
}: LogoProps) {
  return (
    <Image
      src={BACKSTAGE_LOGO_PATH}
      alt="Backstage"
      width={BACKSTAGE_LOGO_WIDTH}
      height={BACKSTAGE_LOGO_HEIGHT}
      className={cn(
        "h-8 w-auto",
        tone === "ink" && "invert",
        className,
      )}
      priority={priority}
    />
  );
}
