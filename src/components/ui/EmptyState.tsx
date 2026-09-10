import { cn } from "@/lib/utilities/cn";

type EmptyStateProps = {
  action?: React.ReactNode;
  className?: string;
  description: string;
  title: string;
};

export function EmptyState({
  action,
  className,
  description,
  title,
}: EmptyStateProps) {
  return (
    <div className={cn("glass px-5 py-10 sm:px-8", className)}>
      <h2 className="font-display text-display-sm">{title}</h2>
      <p className="mt-4 max-w-[38rem] text-base leading-relaxed text-muted">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
