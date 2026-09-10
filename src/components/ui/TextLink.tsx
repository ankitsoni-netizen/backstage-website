import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utilities/cn";

type TextLinkProps = {
  children: React.ReactNode;
  className?: string;
  href: ComponentProps<typeof Link>["href"];
};

export function TextLink({ children, className, href }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "underline decoration-ink/40 underline-offset-[0.28em] transition-colors duration-200 hover:decoration-ink",
        className,
      )}
    >
      {children}
    </Link>
  );
}
