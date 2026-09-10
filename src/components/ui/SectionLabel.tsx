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
    <p className={cn("flex items-center gap-3 text-kicker text-muted", className)}>
      {index ? (
        <span className="text-[0.65rem] tracking-[0.2em] text-oxblood">{index}</span>
      ) : (
        <span
          aria-hidden
          className="inline-block h-px w-8 shrink-0 bg-current opacity-40"
        />
      )}
      <span>{children}</span>
    </p>
  );
}
