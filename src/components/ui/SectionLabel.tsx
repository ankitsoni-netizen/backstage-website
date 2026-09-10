import { cn } from "@/lib/utilities/cn";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
  index?: string;
};

export function SectionLabel({
  children,
  className,
  index,
}: SectionLabelProps) {
  return (
    <p
      className={cn(
        "flex items-baseline gap-3 text-sm font-medium uppercase tracking-[0.14em] text-ink",
        className,
      )}
    >
      {index ? (
        <span className="text-xs tracking-[0.16em]">{index}</span>
      ) : (
        <span
          aria-hidden
          className="inline-block h-[2px] w-6 shrink-0 bg-signal"
        />
      )}
      <span className="underline decoration-ink/45 underline-offset-[0.28em]">
        {children}
      </span>
    </p>
  );
}
