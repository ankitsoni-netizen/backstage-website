import { cn } from "@/lib/utilities/cn";

type WordmarkProps = {
  className?: string;
};

export function Wordmark({ className }: WordmarkProps) {
  return (
    <span
      className={cn(
        "font-sans text-[1.2rem] font-bold tracking-[-0.04em]",
        className,
      )}
    >
      Backstage
    </span>
  );
}
