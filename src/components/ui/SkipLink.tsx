import { cn } from "@/lib/utilities/cn";

type SkipLinkProps = {
  className?: string;
  href?: string;
};

export function SkipLink({
  className,
  href = "#main-content",
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink",
        className,
      )}
    >
      Skip to content
    </a>
  );
}
