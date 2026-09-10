import { cn } from "@/lib/utilities/cn";

type LoadingBlockProps = {
  className?: string;
  label?: string;
  lines?: 1 | 2 | 3;
};

export function LoadingBlock({
  className,
  label = "Loading",
  lines = 3,
}: LoadingBlockProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("border border-line px-5 py-8 sm:px-8", className)}
    >
      <p className="text-sm font-medium tracking-[0.16em] uppercase">{label}</p>
      <div className="mt-6 flex flex-col gap-3" aria-hidden>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={cn(
              "h-3 bg-line motion-safe:animate-pulse",
              index === lines - 1 ? "w-2/3" : "w-full",
            )}
          />
        ))}
      </div>
    </div>
  );
}
